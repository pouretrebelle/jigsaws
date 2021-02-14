import styled from 'styled-components'
import chroma from 'chroma-js'

const StyledWrapper = styled.div`
  font-size: clamp(16px, 32px, 1.5vw);
  padding: 0 2em;
  max-width: calc(250px + 70%);
  margin: 0 auto;
`

interface Props {
  accentColor?: string
}

const getRgb = (color: string): string => chroma(color).rgb().join(', ')

export const PageWrapper: React.FC<Props> = ({ accentColor, children }) => (
  <StyledWrapper
    style={{ '--color-accent': getRgb(accentColor || 'fuchsia') } as object}
  >
    {children}
  </StyledWrapper>
)
