import type { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { getSketchIds } from 'lib/data/getSketchIds'

import Provider from 'Provider'
import Demo from 'components/Demo'
import { Env } from 'types'

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
      <Provider
        {...props}
        setSketchId={(id) => router.push(`/app/${id}`)}
        env={process.env.NODE_ENV === 'development' ? Env.Dev : Env.Prod}
      >
        <Demo />
      </Provider>
    </>
  )
}

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
