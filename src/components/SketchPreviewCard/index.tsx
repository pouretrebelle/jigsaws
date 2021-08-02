import { useContext, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { EnvContext } from 'env'
import { makeRandomSeed, setLocalStorageSeeds } from 'lib/seeds'
import { ResponsiveImage } from 'components/ResponsiveImage'
import { SketchVariant } from 'components/SketchVariant'
import { ShuffleButton } from 'components/ShuffleButton'

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

type Props = Pick<SketchContent, 'id' | 'designNoiseSeeds' | 'cutNoiseSeeds'>

export const SketchPreviewCard: React.FC<Props> = ({
  id,
  designNoiseSeeds: sketchDesignNoiseSeeds,
  cutNoiseSeeds: sketchCutNoiseSeeds,
}) => {
  const { trackEvent } = useContext(EnvContext)
  const [designNoiseSeeds, setDesignNoiseSeeds] = useState(
    sketchDesignNoiseSeeds.map(makeRandomSeed)
  )
  const [cutNoiseSeeds, setCutNoiseSeeds] = useState(
    sketchCutNoiseSeeds.map(makeRandomSeed)
  )

  const shuffleSeeds = () => {
    setDesignNoiseSeeds(sketchDesignNoiseSeeds.map(makeRandomSeed))
    setCutNoiseSeeds(sketchCutNoiseSeeds.map(makeRandomSeed))
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
              `/api/preview/${id}?width=${width}&designSeeds=${designNoiseSeeds.join(
                ','
              )}&cutSeeds=${cutNoiseSeeds.join(',')}`
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
