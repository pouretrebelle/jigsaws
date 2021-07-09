export const mergeTriangles = <T>(polygon: T[], triangle: T[]): T[] | null => {
  let jsonA = polygon.map((v) => JSON.stringify(v))
  let jsonB = triangle.map((v) => JSON.stringify(v))

  let result: T[] = []

  jsonA.forEach((aSegment, aIndex) => {
    const bIndex = jsonB.indexOf(aSegment)
    // if there's a match
    // and we don't have a result yet
    if (bIndex > -1 && result.length === 0) {
      // check the next character along
      if (
        jsonB.indexOf(jsonA[(aIndex + 1) % jsonA.length]) ===
        (bIndex + 1) % jsonB.length
      ) {
        result = [...polygon]
        result.splice(
          aIndex,
          2,
          ...[...triangle.slice(bIndex), ...triangle.slice(0, bIndex)]
        )

        // if the one after that also matches, remove the middle value
        if (
          jsonB.indexOf(jsonA[(aIndex + 2) % jsonA.length]) ===
          (bIndex + 2) % jsonB.length
        ) {
          result = [...polygon]
          result.splice(aIndex + 1, 1)
        }
      }

      // check the next character along reversed
      if (
        jsonB.indexOf(jsonA[(aIndex + 1) % jsonA.length]) ===
        (bIndex - 1 + jsonB.length) % jsonB.length
      ) {
        result = [...polygon]
        result.splice(
          aIndex,
          2,
          ...[
            ...triangle.slice(0, bIndex).reverse(),
            ...triangle.slice(bIndex).reverse(),
          ]
        )

        // if the one before that also matches, remove the middle value
        if (
          jsonB.indexOf(jsonA[(aIndex + 2) % jsonA.length]) ===
          (bIndex - 2 + jsonB.length) % jsonB.length
        ) {
          result = [...polygon]
          result.splice(aIndex + 1, 1)
        }
      }
    }
  })

  if (result.length) {
    // result.forEach((segment, segmentI) => {
    //   if (JSON.stringify(segment) === JSON.stringify(result[segmentI + 2 % result.length])) {
    //     result.splice(segmentI, 2)
    //   }
    // })
    return result
  }

  return null
}

export const recursivelyMergeTriangles = <T>(triangles: T[][]): T[][] => {
  let result: T[][] = [triangles[0]]
  let pool: T[][] = [...triangles.slice(1)]

  pool.forEach((triangle) => {
    result.forEach((polygon, polygonIndex) => {
      const merge = mergeTriangles(polygon, triangle)
      if (merge) {
        result.splice(polygonIndex, 1, merge)
      } else {
        result.push(triangle)
      }
    })
  })

  return result
}
