import { useContext, useState, useLayoutEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { EnvContext } from 'env'
import { setLocalStorageSeeds } from 'lib/seeds'
import { ResponsiveImage } from 'components/ResponsiveImage'
import { SketchVariant } from 'components/SketchVariant'
import { ShuffleButton } from 'components/ShuffleButton'

import { PreviewContext } from './PreviewContext'
export { PreviewProvider } from './PreviewContext'

const PIXEL_DENSITY =
  typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

const StyledArticle = styled.article`
  min-width: 0;
  font-size: 0.75em;
`

const StyledLink = styled.a`
  display: block;
  padding: 10%;
  background: #111;
`

const StyledMeta = styled.aside`
  display: flex;
  min-width: 0;
  gap: 0.5em;

  > *:first-child {
    flex: 1;
  }
`

const StyledActions = styled.div`
  flex: 0 0 0;
`

type Props = Pick<SketchContent, 'id'>

export const SketchPreviewCard: React.FC<Props> = ({ id }) => {
  const { getDesignNoiseSeeds, getCutNoiseSeeds } = useContext(PreviewContext)
  const { trackEvent } = useContext(EnvContext)

  const [designNoiseSeeds, setDesignNoiseSeeds] = useState<string[]>([])
  const [cutNoiseSeeds, setCutNoiseSeeds] = useState<string[]>([])

  useLayoutEffect(() => {
    setDesignNoiseSeeds(getDesignNoiseSeeds())
    setCutNoiseSeeds(getCutNoiseSeeds())
  }, [])

  const shuffleSeeds = () => {
    setDesignNoiseSeeds(getDesignNoiseSeeds())
    setCutNoiseSeeds(getCutNoiseSeeds())
    trackEvent('Shuffle preview seeds', { id })
  }

  return (
    <StyledArticle>
      <Link href={`/app/${id}`} passHref>
        <StyledLink
          onClick={() =>
            setLocalStorageSeeds({
              designNoiseSeeds,
              cutNoiseSeeds,
            })
          }
        >
          <ResponsiveImage
            formatPath={({ width }) =>
              `/api/preview/${id}?width=${width}&designNoiseSeeds=${designNoiseSeeds.join(
                '-'
              )}&cutNoiseSeeds=${cutNoiseSeeds.join('-')}&lineWidth=${
                PIXEL_DENSITY / 4
              }`
            }
            aspectRatio={1}
          />
        </StyledLink>
      </Link>
      <StyledMeta>
        <SketchVariant
          designNoiseSeeds={designNoiseSeeds}
          cutNoiseSeeds={cutNoiseSeeds}
        />
        <StyledActions>
          <ShuffleButton onClick={shuffleSeeds} />
        </StyledActions>
      </StyledMeta>
    </StyledArticle>
  )
}
