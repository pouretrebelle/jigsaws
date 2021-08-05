import fs from 'fs'

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
  send: (arg0: string | Cache) => void
  pipe: (arg0: any) => void
}

const cacheDesign = async (seeds: string, json: Cache) => {
  json.designNoiseSeeds.push(seeds)
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

  if (designNoiseSeeds) await cacheDesign(designNoiseSeeds, json)
  if (cutNoiseSeeds) await cacheCut(cutNoiseSeeds, json)

  fs.writeFileSync(cachePath, JSON.stringify(json))
  console.log(`Write file ${cachePath}`)

  const tempPath = `src/.temp/sketches/${sketch}/cache.json`
  fs.copyFileSync(cachePath, tempPath)
  console.log(`Write file ${tempPath}`)

  res.send(json)
}

export default handler
