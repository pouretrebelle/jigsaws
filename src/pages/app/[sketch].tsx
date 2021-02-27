import type { GetStaticProps, GetStaticPaths } from 'next'

import { SketchContent } from 'types'
import { getAllSketchContent } from 'lib/data/getAllSketchContent'
import { SketchProvider } from 'store/Provider'
import { Favicon } from 'components/Favicon'
import { SEO } from 'components/SEO'
import Demo from 'components/Demo'

interface Props {
  sketch: SketchContent
  sketchId: string
  sketchIds: string[]
}

const App: React.FC<Props> = ({ sketch, ...props }) => (
  <>
    <Favicon accentColorRgb={sketch.accentColorRgb} />
    <SEO
      title={`${sketch.id} Explorer`}
      description={sketch.excerpt}
      imagePath={sketch.imagePath.canvas}
      smallImage
    />
    <SketchProvider {...props}>
      <Demo />
    </SketchProvider>
  </>
)

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
  const sketches = getAllSketchContent()
  const sketchIds = sketches.map((sketch) => sketch.id)
  const sketch = sketches.find(({ id }) => id === params?.sketch)

  return {
    props: {
      sketchId: params?.sketch,
      sketchIds,
      sketch,
    },
  }
}
export default App
