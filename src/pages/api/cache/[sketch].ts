import fs from 'fs'
import cloudinary from 'cloudinary'
import SimplexNoise from 'simplex-noise'
import { createCanvas } from 'canvas'

import { Design } from 'types'
import { formatSeeds, MM_TO_INCH } from 'lib/export'

interface Cache {
  cutNoiseSeeds: string[]
  designNoiseSeeds: string[]
}

interface Req {
  query: {
    sketch: string
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
  const c = canvas.getContext('2d') as CanvasRenderingContext2D

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

const cacheCut = async (seeds: string, json: Cache) => {
  json.cutNoiseSeeds.push(seeds)
}

const handler = async (req: Req, res: Res) => {
  const { sketch, designNoiseSeeds, cutNoiseSeeds } = req.query
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
  if (cutNoiseSeeds) await cacheCut(cutNoiseSeeds, json)

  if (result.status === 200) {
    try {
      fs.writeFileSync(cachePath, JSON.stringify(json))
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
