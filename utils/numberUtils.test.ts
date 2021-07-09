import { map } from './numberUtils'

describe('map', () => {
  it('returns mapped number', () => {
    expect(map(5, 0, 10, 0, 100)).toEqual(50)
    expect(map(6, 5, 10, 0, 100)).toEqual(20)
    expect(map(5, 0, 10, 100, 200)).toEqual(150)
  })
  it('clamps result', () => {
    expect(map(5, 0, 10, 0, 100, true)).toEqual(50)
    expect(map(-5, 0, 10, 0, 100, true)).toEqual(0)
    expect(map(15, 0, 10, 0, 100, true)).toEqual(100)
  })
})
