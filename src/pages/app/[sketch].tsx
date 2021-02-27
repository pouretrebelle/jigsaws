import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchProvider } from 'store/Provider'
import Demo from 'components/Demo'

interface Props {
  sketchId: string
  sketchIds: string[]
}

const App = (props: Props) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{props.sketchId} (Generative Jigsaws)</title>
      </Head>
      <SketchProvider {...props}>
        <Demo />
      </SketchProvider>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const sketchIds = getAllSketchContent().map((sketch) => sketch.id)
  const paths = sketchIds.map((sketch) => ({
    params: { sketch },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const sketchIds = getAllSketchContent().map((sketch) => sketch.id)

  return {
    props: {
      sketchId: params && params.sketch,
      sketchIds,
    },
  }
}
export default App
