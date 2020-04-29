import React from 'react'
import styled from 'styled-components'

import Loader from 'components/Loader'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  loading: boolean
}

const StyledExportButton = styled.button`
  position: relative;
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0 0;
  background: #eee;
  border: 1px solid #ccc;
  border-radius: 3px;
  text-align: center;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e0e0e0;
  }

  &:focus {
    border: 1px solid #aaa;
  }
`

const ExportButton: React.FC<Props> = ({ children, onClick, loading }) => (
  <StyledExportButton
    onClick={onClick}
    style={loading ? { color: 'transparent' } : {}}
  >
    {loading && <Loader style={{ color: '#000' }} />}
    {children}
  </StyledExportButton>
)

export default ExportButton
