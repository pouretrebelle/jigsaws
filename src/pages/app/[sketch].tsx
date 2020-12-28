import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'

import { getSketchIds } from 'lib/data/getSketchIds'

import Provider from 'Provider'
import Demo from 'components/Demo'

interface Props {
  sketchId: string
  sketchIds: string[]
}

const App = (props: Props) => (
  <>
    <Head>
      <title>{props.sketchId} (Generative Jigsaws)</title>
    </Head>
    <Provider {...props}>
      <Demo />
    </Provider>
  </>
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
  const sketchIds = getSketchIds()

  return {
    props: {
      sketchId: params && params.sketch,
      sketchIds,
    },
  }
}
export default App
