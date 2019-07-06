import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import RefreshButton from './RefreshButton'

const Wrapper = styled.div`
  position: relative;
  font-size: 0.75rem;
  margin: 0.25rem 0;

  ${({ index }) =>
    index !== undefined &&
    `
    &:before {
      content: "${index}";
      display: inline-block;
      position: absolute;
      top: 1px;
      width: 1.5rem;
      padding: 0.25rem 0;
      text-align: center;
      border-right: 1px solid #ccc;
    }
  `};
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.25rem 0.5rem 0.25rem 2rem;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: inherit;

  &:focus {
    border: 1px solid #aaa;
  }
`

const RefreshWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 1px;
  padding: 0.325rem;
  opacity: 0;
  transition: opacity 0.2s linear;

  ${Wrapper}:hover & {
    opacity: 1;
  }
`

const Input = ({ value, onChange, onRefresh, ...props }) => (
  <Wrapper index={props.index}>
    <StyledInput
      type="text"
      value={value}
      onChange={(e) => onChange({ value: e.target.value, ...props })}
    />

    <RefreshWrapper>
      <RefreshButton onClick={() => onRefresh(props)} />
    </RefreshWrapper>
  </Wrapper>
)

Input.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}

export default Input
