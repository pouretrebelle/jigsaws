import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { SketchContext } from 'Provider'
import { loadSketch } from 'store/actions'

const H1 = styled.h1`
  margin: 0 0 0.5rem;
`

const Select = styled.select`
  vertical-align: text-top;
  font-weight: bold;
  background: transparent;

  &:focus {
    outline: none;
    box-shadow: 0 2px 0 #aaa;
  }
`

const Selector = () => {
  const [{ sketch, initialSketch }, dispatch] = useContext(SketchContext)

  useEffect(() => {
    dispatch(loadSketch(initialSketch))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <H1>
        Sketch
        <Select
          value={sketch?.id || initialSketch}
          onChange={(e) => dispatch(loadSketch(e.target.value))}
        >
          {SKETCH_IDS.map((id) => (
            <option
              key={id}
              value={id}
              onChange={() => dispatch(loadSketch(id))}
            >
              {id}
            </option>
          ))}
        </Select>
      </H1>
    </>
  )
}

export default Selector
