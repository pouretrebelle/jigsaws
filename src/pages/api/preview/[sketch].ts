import SimplexNoise from 'simplex-noise'
import { createCanvas, Image } from 'canvas'
import { btoa } from 'abab'

import { Design, Cut } from 'types'
import { makeRandomSeed } from 'lib/seeds'
import { buildCloudinaryImageUrl } from 'components/CloudinaryImage'

interface Req {
  query: {
    sketch?: string
    cached?: 'true'
    width?: string
    pixelDensity?: string
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
  const { sketch, width, cached } = req.query

  const { settings, design, DesignNoiseSeeds, cut, CutNoiseSeeds } =
    await import(`.temp/sketches/${sketch || '001'}/index.ts`)

  let cache
  try {
    cache = await import(`.temp/sketches/${sketch || '001'}/cache.json`)
  } catch {}

  const canvasWidth = width ? parseInt(width) : 200
  const lineWidth =
    Math.round(
      (canvasWidth / 1000) *
        (req.query.pixelDensity ? parseFloat(req.query.pixelDensity) : 1) *
        100
    ) / 100

  const queryDesignNoiseSeeds = req.query.designNoiseSeeds
    ? req.query.designNoiseSeeds.split('-')
    : []
  const queryCutNoiseSeeds = req.query.cutNoiseSeeds
    ? req.query.cutNoiseSeeds.split('-')
    : []

  const canvas = createCanvas(canvasWidth, canvasWidth)
  const c = canvas.getContext('2d') as unknown as CanvasRenderingContext2D

  let designNoiseSeeds = Object.keys(DesignNoiseSeeds)
  designNoiseSeeds = designNoiseSeeds
    .slice(0, designNoiseSeeds.length / 2)
    .map((_, i) => queryDesignNoiseSeeds[i] || makeRandomSeed())

  const designScale = (canvasWidth + lineWidth) / settings.width

  if (settings.backgroundColor) {
    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, canvasWidth, canvasWidth)
  }

  const cacheBleed = Math.ceil(
    (canvasWidth * (settings.bleed + lineWidth / 4)) /
      (settings.width + settings.bleed * 2)
  )
  const cacheWidth = canvasWidth + cacheBleed * 2

  if (
    cached ||
    (cache?.designNoiseSeeds &&
      cache.designNoiseSeeds.includes(designNoiseSeeds.join('-')))
  ) {
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
    design({
      c,
      createCanvas,
      seed: designNoiseSeeds,
      simplex: designNoiseSeeds.map((seed) => new SimplexNoise(seed)),
      noiseStart: 0,
      ...settings,
      width: settings.width ?? undefined,
      height: settings.height ?? undefined,
      bleed: 0,
    } as Design)
    c.restore()
  }

  let cutNoiseSeeds = Object.keys(CutNoiseSeeds)
  cutNoiseSeeds = cutNoiseSeeds
    .slice(0, cutNoiseSeeds.length / 2)
    .map((_, i) => queryCutNoiseSeeds[i] || makeRandomSeed())

  c.strokeStyle = 'black'

  if (
    cached ||
    (cache?.cutNoiseSeeds &&
      cache.cutNoiseSeeds.includes(cutNoiseSeeds.join('-')))
  ) {
    const imageUrl = buildCloudinaryImageUrl(
      `${sketch}_${cutNoiseSeeds.join('-')}.svg`,
      { c: 'scale', w: cacheWidth, h: cacheWidth }
    )

    const result = await fetch(imageUrl)
    let svg = await result.text()
    // append a style tag after the first closed tag to set the line width, proper dodgy
    svg = svg.replace(
      `>`,
      `><style>path { stroke-width: ${lineWidth / designScale}px</style>`
    )

    const image = new Image()
    await new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image.width)
      }
      image.onerror = reject
      image.src = `data:image/svg+xml;base64,${btoa(svg)}`
    })
    image.width = cacheWidth
    image.height = cacheWidth

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
