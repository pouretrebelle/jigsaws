import React from 'react'
import styled from 'styled-components'

interface Props {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const StyledLabel = styled.label`
  font-size: 0.5rem;
  margin: 1rem 0 0;
`

const StyledRangeInput = styled.input`
  width: 100%;
  cursor: pointer;
`

const RangeSlider: React.FC<Props> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
}) => (
  <StyledLabel>
    {label}

    <StyledRangeInput
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
  </StyledLabel>
)

export default RangeSlider
