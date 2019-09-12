import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledToggleButton = styled.button`
  width: 12px;
  height: 12px;
  vertical-align: middle;
  margin: 0 0 2px 6px;
  border-radius: 50% 50%;
  cursor: pointer;
  outline: none;
  background: ${({ active }) => (active ? '#3ad663' : '#ccc')};
`

const ToggleButton = ({ active, onClick }) => (
  <StyledToggleButton onClick={onClick} active={active}></StyledToggleButton>
)

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
}

export default ToggleButton
