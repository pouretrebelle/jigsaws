import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { EnvContext } from 'env'
import { SketchContext } from 'store/Provider'
import { loadSketch } from 'store/actions'

const H1 = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`

const Select = styled.select`
  font-weight: bold;
  background: transparent;
  font-size: inherit;

  &:focus {
    outline: none;
    box-shadow: 0 2px 0 #aaa;
  }
`

const Selector = () => {
  const [{ sketch, sketchId, sketchIds }, dispatch] = useContext(SketchContext)
  const { setAppSketchId } = useContext(EnvContext)

  useEffect(() => {
    dispatch(loadSketch(sketchId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sketchId])

  return (
    <>
      <H1>
        Sketch
        <Select
          value={sketch?.id || sketchId}
          onChange={(e) => setAppSketchId(e.target.value)}
        >
          {sketchIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Select>
      </H1>
    </>
  )
}

export default Selector
