import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledExportButton = styled.button`
  width: 100%;
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0;
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

const ExportButton = ({ children, onClick }) => (
  <StyledExportButton onClick={onClick}>{children}</StyledExportButton>
)

ExportButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
}

export default ExportButton
