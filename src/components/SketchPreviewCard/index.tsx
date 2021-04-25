import { useState } from 'react'
import styled from 'styled-components'

import { SketchContent } from 'types'
import { makeRandomSeed } from 'lib/seeds'
import { ResponsiveImage } from 'components/ResponsiveImage'
import RefreshButton from 'components/AppSidebar/Controls/RefreshButton'

const StyledMeta = styled.aside`
  display: flex;
  min-width: 0;
`

const StyledName = styled.div`
  flex: 1;
  font-size: 0.75em;
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

  const refreshSeeds = () => {
    setDesignSeeds(designNoiseSeeds.map(makeRandomSeed))
    setCutSeeds(cutNoiseSeeds.map(makeRandomSeed))
  }

  return (
    <article>
      <ResponsiveImage
        formatPath={({ width }) =>
          `/api/preview/${id}?width=${width}&designSeeds=${designSeeds.join(
            ','
          )}&cutSeeds=${cutSeeds.join(',')}`
        }
        aspectRatio={1}
      />
      <StyledMeta>
        <StyledName>
          {designSeeds.join('-')}_{cutSeeds.join('-')}
        </StyledName>
        <StyledActions>
          <RefreshButton onClick={refreshSeeds} />
        </StyledActions>
      </StyledMeta>
    </article>
  )
}
