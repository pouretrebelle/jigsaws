import SimplexNoise from 'simplex-noise'
import { createCanvas, Image } from 'canvas'

import { Design, Cut } from 'types'
import { makeRandomSeed } from 'lib/seeds'
import { buildCloudinaryImageUrl } from 'components/CloudinaryImage'

interface Req {
  query: {
    sketch?: string
    width?: string
    lineWidth?: string
    designNoiseSeeds?: string
    cutNoiseSeeds?: string
  }
}

type Res = NodeJS.WritableStream & {
  setHeader: (arg0: string, arg1: string) => void
  status: (arg0: number) => Res
  send: (arg0: string) => void
  pipe: (arg0: any) => void
}

const handler = async (req: Req, res: Res) => {
  res.setHeader('content-type', 'image/png')
  const { sketch, width } = req.query

  const { settings, design, DesignNoiseSeeds, cut, CutNoiseSeeds } =
    await import(`.temp/sketches/${sketch || '001'}/index.ts`)

  let cache
  try {
    cache = await import(`.temp/sketches/${sketch || '001'}/cache.json`)
  } catch {}

  const canvasWidth = width ? parseInt(width) : 200
  const lineWidth = req.query.lineWidth ? parseFloat(req.query.lineWidth) : 0

  const queryDesignNoiseSeeds = req.query.designNoiseSeeds
    ? req.query.designNoiseSeeds.split(',')
    : []
  const queryCutNoiseSeeds = req.query.cutNoiseSeeds
    ? req.query.cutNoiseSeeds.split(',')
    : []

  const canvas = createCanvas(canvasWidth, canvasWidth)
  const c = canvas.getContext('2d') as CanvasRenderingContext2D

  let designNoiseSeeds = Object.keys(DesignNoiseSeeds)
  designNoiseSeeds = designNoiseSeeds
    .slice(0, designNoiseSeeds.length / 2)
    .map((_, i) => queryDesignNoiseSeeds[i] || makeRandomSeed())

  const designScale = (canvasWidth + lineWidth) / settings.width

  if (settings.backgroundColor) {
    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, canvasWidth, canvasWidth)
  }

  if (
    cache?.designNoiseSeeds &&
    cache.designNoiseSeeds.includes(designNoiseSeeds.join('-'))
  ) {
    const cacheBleed = Math.round(
      (canvasWidth - lineWidth) *
        (settings.bleed / (settings.width + settings.bleed * 2))
    )
    const cacheWidth = canvasWidth + cacheBleed * 2
    const imageUrl = buildCloudinaryImageUrl(
      `${sketch}_${designNoiseSeeds.join('-')}.png`,
      { c: 'scale', w: cacheWidth, h: cacheWidth }
    )

    const image = new Image()
    await new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image.width)
      }
      image.onerror = reject
      image.src = imageUrl
    })

    c.save()
    c.translate(-cacheBleed, -cacheBleed)
    c.drawImage(
      image as unknown as HTMLImageElement,
      0,
      0,
      cacheWidth,
      cacheWidth
    )
    c.restore()
  } else {
    c.save()
    c.translate(-lineWidth / 2, -lineWidth / 2)
    c.scale(designScale, designScale)
    c.translate(-settings.bleed, -settings.bleed)
    design({
      c,
      createCanvas,
      seed: designNoiseSeeds,
      simplex: designNoiseSeeds.map((seed) => new SimplexNoise(seed)),
      noiseStart: 0,
      ...settings,
      width: settings.width ? settings.width + settings.bleed * 2 : undefined,
      height: settings.height
        ? settings.height + settings.bleed * 2
        : undefined,
    } as Design)
    c.restore()
  }

  if (lineWidth) {
    let cutNoiseSeeds = Object.keys(CutNoiseSeeds)
    cutNoiseSeeds = cutNoiseSeeds
      .slice(0, cutNoiseSeeds.length / 2)
      .map((_, i) => queryCutNoiseSeeds[i] || makeRandomSeed())

    c.strokeStyle = 'black'
    c.lineWidth = lineWidth / designScale

    c.save()
    c.translate(-lineWidth / 2, -lineWidth / 2)
    c.scale(designScale, designScale)
    cut({
      c,
      seed: cutNoiseSeeds,
      simplex: cutNoiseSeeds.map((seed) => new SimplexNoise(seed)),
      noiseStart: 0,
      ...settings,
    } as Cut)
    c.restore()
  }

  canvas.createPNGStream().pipe(res)
}

export default handler
