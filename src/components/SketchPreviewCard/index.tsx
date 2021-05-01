import { useState } from 'react'
import styled from 'styled-components'

import { SketchContent } from 'types'
import { makeRandomSeed } from 'lib/seeds'
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
`

const StyledActions = styled.div`
  flex: 0 0 0;
`

type Props = Pick<SketchContent, 'id' | 'designNoiseSeeds' | 'cutNoiseSeeds'>

export const SketchPreviewCard: React.FC<Props> = ({
  id,
  designNoiseSeeds,
  cutNoiseSeeds,
}) => {
  const [designSeeds, setDesignSeeds] = useState(
    designNoiseSeeds.map(makeRandomSeed)
  )
  const [cutSeeds, setCutSeeds] = useState(cutNoiseSeeds.map(makeRandomSeed))

  const shuffleSeeds = () => {
    setDesignSeeds(designNoiseSeeds.map(makeRandomSeed))
    setCutSeeds(cutNoiseSeeds.map(makeRandomSeed))
  }

  return (
    <StyledArticle>
      <ResponsiveImage
        formatPath={({ width }) =>
          `/api/preview/${id}?width=${width}&designSeeds=${designSeeds.join(
            ','
          )}&cutSeeds=${cutSeeds.join(',')}`
        }
        aspectRatio={1}
      />
      <StyledMeta>
        <SketchVariant
          designNoiseSeeds={designSeeds}
          cutNoiseSeeds={cutSeeds}
        />
        <StyledActions>
          <ShuffleButton onClick={shuffleSeeds} />
        </StyledActions>
      </StyledMeta>
    </StyledArticle>
  )
}
