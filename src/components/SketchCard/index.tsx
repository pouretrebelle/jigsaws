import Link from 'next/link'

import { SketchContent } from 'types'

export const SketchCard = ({
  id,
  html,
  youTubeLink,
  appLink,
}: SketchContent) => (
  <>
    <h2>{id}</h2>

    <div dangerouslySetInnerHTML={{ __html: html }} />

    <a href={youTubeLink}>Watch solve</a>
    <Link href={appLink}>Open</Link>
  </>
)
