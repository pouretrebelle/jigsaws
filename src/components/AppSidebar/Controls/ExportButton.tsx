import React from 'react'
import styled from 'styled-components'

import Loader from 'components/Loader'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  loading?: boolean
  ext: string
}

const StyledExportButton = styled.button`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 0;
  background: #eee;
  border-radius: 3px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 -1px 3px inset #ccc;

  &:hover {
    background: #e0e0e0;
  }

  &:active {
    box-shadow: 0 1px 3px inset #ccc;
    top: 1px;
  }
`

const StyledExt = styled.aside`
  opacity: 0.8;
`

const ExportButton: React.FC<Props> = ({ children, onClick, loading, ext }) => (
  <StyledExportButton
    onClick={onClick}
    style={loading ? { color: 'transparent' } : {}}
  >
    {loading && <Loader style={{ color: '#000' }} />}
    {children} <StyledExt>.{ext}</StyledExt>
  </StyledExportButton>
)

export default ExportButton
