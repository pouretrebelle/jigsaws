import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { Header } from 'components/Header'
import { SketchCard } from 'components/SketchCard'

interface Props {
  sketch: SketchContent
}

const HomePage = ({ sketch }: Props) => (
  <PageWrapper accentColorRgb={sketch.accentColorRgb}>
    <Head>
      <title>Abstract Puzzles</title>
    </Head>
    <Header />

    <SketchCard key={sketch.id} {...sketch} />
  </PageWrapper>
)

export const getStaticPaths: GetStaticPaths = async () => {
  const sketchIds = getSketchIds()
  const paths = sketchIds.map((sketch) => ({
    params: { sketch },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const sketchId = (params && params.sketch) as string
  const sketch = getSketchContent(sketchId)

  return {
    props: {
      sketch,
    },
  }
}

export default HomePage
