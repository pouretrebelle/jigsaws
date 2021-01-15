import type { GetStaticProps } from 'next'
import Head from 'next/head'

import { getSketchIds } from 'lib/data/getSketchIds'
import { getSketchContent } from 'lib/data/getSketchContent'
import { SketchContent } from 'types'
import { SketchCard } from 'components/SketchCard'

const NOW = new Date()

interface Props {
  sketches: SketchContent[]
}

const HomePage = ({ sketches }: Props) => (
  <>
    <Head>
      <title>Abstract Puzzles</title>
    </Head>
    <h1>Abstract Puzzles</h1>

    {sketches.map((content) => (
      <SketchCard key={content.id} {...content} />
    ))}
  </>
)

export const getStaticProps: GetStaticProps = async () => {
  const sketchIds = getSketchIds()
  const sketches = sketchIds
    .map(getSketchContent)
    .map(({ id, html, data: { datePublished, ...data } }) => ({
      id,
      html,
      appLink: `/app/${id}`,
      datePublished: +datePublished, // needs to be number to be parsable
      ...data,
    }))
    .filter(({ datePublished }) => datePublished - +NOW < 0)
    .sort(({ datePublished: aDate }, { datePublished: bDate }) => bDate - aDate)

  return {
    props: {
      sketches,
    },
  }
}

export default HomePage
