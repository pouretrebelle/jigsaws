import type { GetStaticProps } from 'next'
import Head from 'next/head'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { PageWrapper } from 'components/PageWrapper'
import { Header } from 'components/Header'
import { SketchCard } from 'components/SketchCard'

const NOW = new Date()

interface Props {
  sketches: SketchContent[]
}

const HomePage = ({ sketches }: Props) => (
  <PageWrapper accentColor={sketches[0].accentColor}>
    <Head>
      <title>Abstract Puzzles</title>
    </Head>
    <Header />

    {sketches.map((content) => (
      <SketchCard key={content.id} {...content} />
    ))}
  </PageWrapper>
)

export const getStaticProps: GetStaticProps = async () => {
  const sketchIds = getSketchIds()
  const sketches = sketchIds
    .map(getSketchContent)
    .filter(({ datePublished }) => datePublished - +NOW < 0)
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)

  return {
    props: {
      sketches,
    },
  }
}

export default HomePage
