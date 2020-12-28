import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
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
  const [{ sketch, sketchId, sketchIds }, dispatch] = useContext(
    SketchContext
  )
  const router = useRouter()

  useEffect(() => {
    dispatch(loadSketch(sketchId))
  }, [sketchId])

  const load = (sketch: string) => {
    router.push(`/app/${sketch}`)
    dispatch(loadSketch(sketch))
  }

  return (
    <>
      <H1>
        Sketch
        <Select
          value={sketch?.id || sketchId}
          onChange={(e) => load(e.target.value)}
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
