import styled from 'styled-components'

const StyledWrapper = styled.div`
  font-size: clamp(16px, 32px, 1.5vw);
  padding: 0 2em;
  max-width: calc(250px + 70%);
  margin: 0 auto;
`

interface Props {
  accentColorRgb?: string
}

export const PageWrapper: React.FC<Props> = ({ accentColorRgb, children }) => (
  <StyledWrapper
    style={
      accentColorRgb ? ({ '--color-accent': accentColorRgb } as object) : {}
    }
  >
    {children}
  </StyledWrapper>
)
