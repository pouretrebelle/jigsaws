import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { EnvContext } from 'env'
import { SketchContext } from 'store/Provider'
import { loadSketch } from 'store/actions'
import { ExceptIde } from './IdeOnly'

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
  const [{ sketch, sketchId, sketchIds }, dispatch] = useContext(SketchContext)
  const { setAppSketchId } = useContext(EnvContext)

  useEffect(() => {
    dispatch(loadSketch(sketchId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sketchId])

  return (
    <>
      <H1>
        <ExceptIde>
          <Link href={`/${sketch?.id}`} passHref>
            <a title="Back to site">
              <svg
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                style={{
                  width: '1em',
                  transform: 'rotate(0.5turn)',
                  marginRight: '0.5em',
                }}
              >
                <path
                  d="M9.97 3.47a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H.75a.75.75 0 010-1.5h11.69L9.97 4.53a.75.75 0 010-1.06z"
                  fill="#000"
                />
              </svg>
            </a>
          </Link>
        </ExceptIde>
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
