import { mergeTriangles, recursivelyMergeTriangles } from './shapeUtils'

describe('mergeTriangles', () => {
  it('merges linear sequences', () => {
    expect(mergeTriangles([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4])
    expect(mergeTriangles([1, 2, 3, 5], [2, 3, 4])).toEqual([1, 2, 3, 4, 5])
  })
  it('non-linear A', () => {
    expect(mergeTriangles([2, 3, 1], [2, 3, 4])).toEqual([2, 3, 4, 1])
    expect(mergeTriangles([2, 3, 5, 1], [2, 3, 4])).toEqual([2, 3, 4, 5, 1])
  })
  it('non-linear B', () => {
    expect(mergeTriangles([1, 2, 3], [3, 4, 2])).toEqual([1, 2, 3, 4])
  })
  it('reverse', () => {
    expect(mergeTriangles([2, 3, 1], [4, 3, 2])).toEqual([3, 4, 2, 1])
  })
  it('complex data', () => {
    expect(mergeTriangles([[1], [2], [3]], [[3], [4], [2]])).toEqual([
      [1],
      [2],
      [3],
      [4],
    ])
  })
  it('dedupes', () => {
    expect(mergeTriangles([1, 2, 3, 4, 5], [2, 3, 4])).toEqual([1, 2, 4, 5])
  })
  it('dedupe reverse', () => {
    expect(mergeTriangles([1, 2, 3, 4, 5], [4, 3, 2])).toEqual([1, 2, 4, 5])
  })
})

describe('recursivelyMergeTriangles', () => {
  it('basic functionality', () => {
    expect(
      recursivelyMergeTriangles([
        [1, 2, 3],
        [2, 3, 4],
      ])
    ).toEqual([[1, 2, 3, 4]])
  })
  it('merges', () => {
    expect(
      recursivelyMergeTriangles([
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ])
    ).toEqual([[1, 2, 3, 4, 5]])
    expect(
      recursivelyMergeTriangles([
        [0, 1, 2],
        [0, 2, 3],
        [0, 3, 4],
        [0, 4, 5],
      ])
    ).toEqual([[0, 1, 2, 3, 4, 5]])
  })
  it('island', () => {
    expect(
      recursivelyMergeTriangles([
        [1, 2, 3],
        [2, 3, 4],
        [8, 9, 10],
      ])
    ).toEqual([
      [1, 2, 3, 4],
      [8, 9, 10],
    ])
  })
})
