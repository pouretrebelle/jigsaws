import styled from 'styled-components'
import chroma from 'chroma-js'

import { SketchContent } from 'types'
import { COLOR } from 'styles/tokens'

const StyledSketchVariant = styled.span`
  position: relative;
  letter-spacing: -0.1ch;
  min-width: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 1.5em;
    width: 2em;
    background: linear-gradient(
      to left,
      ${COLOR.BACKGROUND},
      ${chroma(COLOR.BACKGROUND).alpha(0.3).hex()},
      ${chroma(COLOR.BACKGROUND).alpha(0).hex()}
    );
    pointer-events: none;
  }
`

const StyledInner = styled.span`
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  vertical-align: bottom;
`

const StyledIcon = styled.svg`
  width: 0.6em;
  height: 0.6em;
  stroke: currentColor;
  fill: transparent;
  vertical-align: unset;
  margin-right: 0.2em;
`

type Props = Pick<SketchContent, 'designNoiseSeeds' | 'cutNoiseSeeds'>

export const SketchVariant = ({ designNoiseSeeds, cutNoiseSeeds }: Props) => {
  const identifier = `${designNoiseSeeds.join('-')}_${cutNoiseSeeds.join('-')}`
  return (
    <StyledSketchVariant title={identifier} aria-hidden>
      <StyledInner>
        <StyledIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7">
          <path
            d="M.5 3.50012h6M2 .901978L5 6.09813M2 6.09814L5 .901992"
            strokeLinecap="round"
          />
        </StyledIcon>
        {identifier}
      </StyledInner>
    </StyledSketchVariant>
  )
}
