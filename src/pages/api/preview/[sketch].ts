import SimplexNoise from 'simplex-noise'
import { createCanvas } from 'canvas'

import { Design, Cut } from 'types'
import { makeRandomSeed } from 'lib/seeds'

interface Req {
  query: {
    sketch?: string,
    width?: string,
    designSeeds?: string,
    cutSeeds?: string,
  }
}

type Res = NodeJS.WritableStream & {
  setHeader: (arg0: string, arg1: string) => void;
  status: (arg0: number) => Res
  send: (arg0: string) => void
  pipe: (arg0: any) => void
}

const handler = async (req: Req, res: Res) => {
  res.setHeader('content-type', 'image/png')

  const { settings, design, DesignNoiseSeeds, cut, CutNoiseSeeds } = await import(`../../../../sketches/${req.query.sketch || '001'}/index.ts`)

  const canvasWidth = req.query.width ? parseInt(req.query.width) : 200
  const queryDesignSeeds = req.query.designSeeds ? req.query.designSeeds.split(',') : []
  const queryCutSeeds = req.query.cutSeeds ? req.query.cutSeeds.split(',') : []

  const canvas = createCanvas(canvasWidth, canvasWidth)
  const c = canvas.getContext('2d') as CanvasRenderingContext2D
  const canvasBleed = canvasWidth * 0.1

  const designWidth = canvasWidth - canvasBleed * 2
  const designCanvas = createCanvas(designWidth, designWidth)
  const designC = designCanvas.getContext('2d') as CanvasRenderingContext2D
  const designSeeds = Object.keys(DesignNoiseSeeds).map((_, i) => queryDesignSeeds[i] || makeRandomSeed())

  const designScale = designWidth / (settings.width)

  designC.save()
  designC.scale(designScale, designScale)
  designC.translate(-settings.bleed, -settings.bleed)

  if (settings.backgroundColor) {
    c.fillStyle = settings.backgroundColor
    c.fillRect(0, 0, designWidth, designWidth)
  }

  design({
    c: designC,
    seed: designSeeds,
    simplex: designSeeds.map(seed => new SimplexNoise(seed)),
    noiseStart: 0,
    ...settings,
    width: settings.width ? settings.width + settings.bleed * 2 : undefined,
    height: settings.height ? settings.height + settings.bleed * 2 : undefined,
  } as Design)
  designC.restore()

  const cutSeeds = Object.keys(CutNoiseSeeds).map((_, i) => queryCutSeeds[i] || makeRandomSeed())

  designC.strokeStyle = 'black'
  designC.lineWidth = 0.5 / designScale

  designC.save()
  designC.scale(designScale, designScale)
  cut({
    c: designC,
    seed: cutSeeds,
    simplex: cutSeeds.map(seed => new SimplexNoise(seed)),
    noiseStart: 0,
    ...settings
  } as Cut)
  designC.restore()


  c.fillStyle = '#111'
  c.fillRect(0, 0, canvasWidth, canvasWidth)
  c.translate(canvasBleed, canvasBleed)
  c.drawImage(designCanvas as unknown as CanvasImageSource, 0, 0)

  canvas.createPNGStream().pipe(res)
}

export default handler
