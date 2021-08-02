import SimplexNoise from 'simplex-noise'
import { createCanvas } from 'canvas'

import { Design, Cut } from 'types'
import { makeRandomSeed } from 'lib/seeds'

interface Req {
  query: {
    sketch?: string
    width?: string
    designSeeds?: string
    cutSeeds?: string
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

  const { settings, design, DesignNoiseSeeds, cut, CutNoiseSeeds } =
    await import(`.temp/sketches/${req.query.sketch || '001'}/index.ts`)

  const canvasWidth = req.query.width ? parseInt(req.query.width) : 200
  const queryDesignSeeds = req.query.designSeeds
    ? req.query.designSeeds.split(',')
    : []
  const queryCutSeeds = req.query.cutSeeds ? req.query.cutSeeds.split(',') : []

  const canvas = createCanvas(canvasWidth, canvasWidth)
  const c = canvas.getContext('2d') as CanvasRenderingContext2D

  const designSeeds = Object.keys(DesignNoiseSeeds).map(
    (_, i) => queryDesignSeeds[i] || makeRandomSeed()
  )

  const designScale = canvasWidth / settings.width

  c.save()
  c.scale(designScale, designScale)
  c.translate(-settings.bleed, -settings.bleed)

  if (settings.backgroundColor) {
    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, canvasWidth, canvasWidth)
  }

  design({
    c,
    createCanvas,
    seed: designSeeds,
    simplex: designSeeds.map((seed) => new SimplexNoise(seed)),
    noiseStart: 0,
    ...settings,
    width: settings.width ? settings.width + settings.bleed * 2 : undefined,
    height: settings.height ? settings.height + settings.bleed * 2 : undefined,
  } as Design)
  c.restore()

  const cutSeeds = Object.keys(CutNoiseSeeds).map(
    (_, i) => queryCutSeeds[i] || makeRandomSeed()
  )

  c.strokeStyle = 'black'
  c.lineWidth = 0.75 / designScale

  c.save()
  c.scale(designScale, designScale)
  cut({
    c,
    seed: cutSeeds,
    simplex: cutSeeds.map((seed) => new SimplexNoise(seed)),
    noiseStart: 0,
    ...settings,
  } as Cut)
  c.restore()

  canvas.createPNGStream().pipe(res)
}

export default handler
