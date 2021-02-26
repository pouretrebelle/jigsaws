import { COLOR } from 'styles/tokens'

interface Req {
  query: { color?: string }
}

interface Res {
  setHeader: (arg0: string, arg1: string) => void;
  status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any } }
}

const handler = (req: Req, res: Res) => {
  const {
    query: { color },
  } = req

  const faviconColor = color ? color.replace(/ /g, '') : COLOR.ACCENT

  res.setHeader('content-type', 'image/svg+xml')
  res.status(200).send(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" fill="${faviconColor}"/>
    </svg>
  `)
}

export default handler
