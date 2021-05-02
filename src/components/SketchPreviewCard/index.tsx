import { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { SketchContent } from 'types'
import { makeRandomSeed, setLocalStorageSeeds } from 'lib/seeds'
import { ResponsiveImage } from 'components/ResponsiveImage'
import { SketchVariant } from 'components/SketchVariant'
import { ShuffleButton } from 'components/ShuffleButton'

const StyledArticle = styled.article`
  min-width: 0;
  font-size: 0.75em;
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
  const [designNoiseSeeds, setDesignNoiseSeeds] = useState(
    sketchDesignNoiseSeeds.map(makeRandomSeed)
  )
  const [cutNoiseSeeds, setCutNoiseSeeds] = useState(
    sketchCutNoiseSeeds.map(makeRandomSeed)
  )

  const shuffleSeeds = () => {
    setDesignNoiseSeeds(sketchDesignNoiseSeeds.map(makeRandomSeed))
    setCutNoiseSeeds(sketchCutNoiseSeeds.map(makeRandomSeed))
  }

  return (
    <StyledArticle>
      <Link href={`/app/${id}`}>
        <a
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
        </a>
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
