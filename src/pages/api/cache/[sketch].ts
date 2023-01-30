import fs from 'fs'
import cloudinary from 'cloudinary'
import SimplexNoise from 'simplex-noise'
import { createCanvas } from 'canvas'
import C2S from 'canvas2svg'
import { JSDOM } from 'jsdom'
import { XMLSerializer } from 'xmldom'
import { btoa } from 'abab'
import prettier from 'prettier'

import { Design, Cache } from 'types'
import { formatSeeds, LASER_CUT_SVG_MULTIPLIER, MM_TO_INCH } from 'lib/export'

interface Req {
  query: {
    sketch: string
  }
  body: {
    designNoiseSeeds?: string
    cutNoiseSeeds?: string
  }
}

type Res = NodeJS.WritableStream & {
  setHeader: (arg0: string, arg1: string) => void
  status: (arg0: number) => Res
  json: (arg0: object) => void
}

interface Result {
  status: number
  message: string
}

const cacheDesign = async ({
  sketch,
  designNoiseSeeds: seeds,
  json,
}: {
  sketch: string
  designNoiseSeeds: string
  json: Cache
}): Promise<Result> => {
  const { settings, design, DesignNoiseSeeds } = await import(
    `.temp/sketches/${sketch}/index.ts`
  )

  const designNoiseSeeds = seeds.split('-')

  if (json.designNoiseSeeds.includes(seeds)) {
    return {
      status: 400,
      message: 'Seeds already cached',
    }
  }

  // enums as an object have keys+values both ways
  if (Object.keys(DesignNoiseSeeds).length / 2 !== designNoiseSeeds.length) {
    return {
      status: 400,
      message: 'Seed count doesn’t match sketch',
    }
  }

  const scale = 300 * MM_TO_INCH
  const canvasWidth = (settings.width + settings.bleed * 2) * scale
  const canvasHeight = (settings.height + settings.bleed * 2) * scale

  const canvas = createCanvas(canvasWidth, canvasHeight)
  const c = canvas.getContext('2d') as unknown as CanvasRenderingContext2D

  c.save()
  c.scale(scale, scale)

  if (settings.backgroundColor) {
    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  design({
    c,
    createCanvas,
    seed: designNoiseSeeds,
    simplex: designNoiseSeeds.map((seed) => new SimplexNoise(seed)),
    noiseStart: 0,
    ...settings,
    width: settings.width ? settings.width + settings.bleed * 2 : undefined,
    height: settings.height ? settings.height + settings.bleed * 2 : undefined,
  } as Design)
  c.restore()

  const filename = `${sketch}_${formatSeeds(designNoiseSeeds)}`
  try {
    await cloudinary.v2.uploader.upload(canvas.toDataURL(), {
      public_id: filename,
      tags: ['cache'],
    })
  } catch (e) {
    console.error(e)

    return {
      status: 500,
      message: 'Cloudinary upload failed',
    }
  }

  console.log(`Cloudinary upload ${filename}.png`)
  json.designNoiseSeeds.push(seeds)

  return {
    status: 200,
    message: 'Cloudinary upload successful',
  }
}

const cacheCut = async ({
  sketch,
  cutNoiseSeeds: seeds,
  json,
}: {
  sketch: string
  cutNoiseSeeds: string
  json: Cache
}): Promise<Result> => {
  const { settings, cut, CutNoiseSeeds } = await import(
    `.temp/sketches/${sketch}/index.ts`
  )

  const cutNoiseSeeds = seeds.split('-')

  if (json.cutNoiseSeeds.includes(seeds)) {
    return {
      status: 400,
      message: 'Seeds already cached',
    }
  }

  // enums as an object have keys+values both ways
  if (Object.keys(CutNoiseSeeds).length / 2 !== cutNoiseSeeds.length) {
    return {
      status: 400,
      message: 'Seed count doesn’t match sketch',
    }
  }

  const { width, height, bleed } = settings

  // https://github.com/gliffy/canvas2svg/issues/78#issuecomment-668298923
  const dom = new JSDOM()
  dom.window.XMLSerializer = XMLSerializer
  global.window = dom.window as any
  global.XMLSerializer = XMLSerializer
  let c = new C2S({
    document: dom.window.document,
    width: LASER_CUT_SVG_MULTIPLIER * (width + bleed * 2),
    height: LASER_CUT_SVG_MULTIPLIER * (height + bleed * 2),
  })
  c.scale(LASER_CUT_SVG_MULTIPLIER)
  c.translate(bleed, bleed)
  c.lineWidth = 0.1
  cut(
    {
      c,
      seed: cutNoiseSeeds,
      simplex: cutNoiseSeeds.map((seed) => new SimplexNoise(seed)),
      noiseStart: 0,
      ...settings,
    },
    false
  )

  const filename = `${sketch}_${formatSeeds(cutNoiseSeeds)}`
  let cloudinaryResponse: cloudinary.UploadApiResponse
  try {
    cloudinaryResponse = await cloudinary.v2.uploader.upload(
      `data:image/svg+xml;base64,${btoa(c.getSerializedSvg())}`,
      { public_id: filename, format: 'svg', tags: ['cache'] }
    )
  } catch (e) {
    console.error(e)

    return {
      status: 500,
      message: 'Cloudinary upload failed',
    }
  }

  console.log(`Cloudinary upload ${filename}.svg`)
  json.cutNoiseSeeds.push(seeds)

  return {
    status: 200,
    message: 'Cloudinary upload successful',
  }
}

const handler = async (req: Req, res: Res) => {
  const { sketch } = req.query
  const { designNoiseSeeds, cutNoiseSeeds } = req.body
  const cachePath = `sketches/${sketch}/cache.json`
  let json: Cache = {
    cutNoiseSeeds: [],
    designNoiseSeeds: [],
  }

  try {
    const data = fs.readFileSync(cachePath, 'utf8')
    json = JSON.parse(data)
  } catch (e) {}

  let result: Result = {
    status: 400,
    message: 'No seeds provided',
  }
  if (designNoiseSeeds) {
    result = await cacheDesign({ sketch, designNoiseSeeds, json })
  }
  if (cutNoiseSeeds) {
    result = await cacheCut({ sketch, cutNoiseSeeds, json })
  }

  if (result.status === 200) {
    const output = prettier.format(JSON.stringify(json), {
      parser: 'json',
    })
    try {
      fs.writeFileSync(cachePath, output)
      console.log(`Write file ${cachePath}`)

      const tempPath = `src/.temp/sketches/${sketch}/cache.json`
      fs.copyFileSync(cachePath, tempPath)
      console.log(`Write file ${tempPath}`)
    } catch (e) {
      console.error(e)
      result = {
        status: 400,
        message: 'Unable to update cache files',
      }
    }
  }

  res.status(result.status).json({ message: result.message })
}

export default handler
