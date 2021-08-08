import { useContext, useState, useEffect, useCallback } from 'react'
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
  font-size: max(14px, 0.75em);
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

type Props = Pick<SketchContent, 'id'> & { primary?: boolean }

export const SketchPreviewCard: React.FC<Props> = ({ id, primary }) => {
  const {
    getDesignNoiseSeeds,
    getCutNoiseSeeds,
    designNoiseSeeds: sketchDesignNoiseSeeds,
    cutNoiseSeeds: sketchCutNoiseSeeds,
  } = useContext(PreviewContext)
  const { trackEvent } = useContext(EnvContext)

  const [designNoiseSeeds, setDesignNoiseSeeds] = useState<string[]>([])
  const [cutNoiseSeeds, setCutNoiseSeeds] = useState<string[]>([])

  useEffect(() => {
    setDesignNoiseSeeds(
      primary ? sketchDesignNoiseSeeds : getDesignNoiseSeeds()
    )
    setCutNoiseSeeds(primary ? sketchCutNoiseSeeds : getCutNoiseSeeds())
  }, [id])

  const shuffleSeeds = () => {
    setDesignNoiseSeeds(getDesignNoiseSeeds())
    setCutNoiseSeeds(getCutNoiseSeeds())
    trackEvent('Shuffle preview seeds', { id })
  }

  const formatPath = useCallback(
    ({ width }) =>
      `/api/preview/${id}?width=${width}&designNoiseSeeds=${designNoiseSeeds.join(
        '-'
      )}&cutNoiseSeeds=${cutNoiseSeeds.join('-')}&lineWidth=${
        PIXEL_DENSITY / 4
      }${
        designNoiseSeeds === sketchDesignNoiseSeeds &&
        cutNoiseSeeds === sketchCutNoiseSeeds &&
        '&cached=true'
      }`,
    [id, designNoiseSeeds, cutNoiseSeeds]
  )

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
          <ResponsiveImage formatPath={formatPath} aspectRatio={1} />
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
