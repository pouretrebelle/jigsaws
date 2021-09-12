import SimplexNoise from 'simplex-noise'
import { map, signFromRandom } from 'utils/numberUtils'
import { getCubicBezierXYatPercent } from 'utils/vectorUtils'
import Vector2 from 'utils/Vector2'
import { Edge, Site } from 'voronoi'
import { MAX_TAB_SIZE, MIN_TAB_SIZE } from './constants'

export interface VectoralEdge {
  edge: Edge
  reverse: boolean
}

const getContinuingEdges = (
  prev: VectoralEdge,
  edges: Edge[]
): VectoralEdge[] => {
  const availableEdges = edges.filter(
    (edge) => !edge.drawn && prev.edge !== edge
  )

  const a = prev.edge
  const aV = prev.reverse ? a.va : a.vb

  return availableEdges
    .filter((b) => aV === b.va || aV === b.vb)
    .map((b) => ({ edge: b, reverse: aV === b.vb }))
}

export const getNextContinuingEdge = (
  prev: VectoralEdge,
  edges: Edge[]
): VectoralEdge | null => {
  const edgeOptions = getContinuingEdges(prev, edges)

  if (edgeOptions.length) {
    // for some reason the last one is always going in the right Vector
    // let's not jinx it
    return edgeOptions[edgeOptions.length - 1]
  }

  return null
}

export const getStartingEdge = (edges: Edge[]): VectoralEdge | null => {
  const undrawnEdges = edges.filter(({ drawn }) => !drawn)

  const startingEdge = undrawnEdges
    .sort((a, b) =>
      // natural order is top to bottom
      // but we want the first row to be left-to-right
      a.va.y === 0 || a.vb.y === 0
        ? Math.min(a.va.x, a.vb.x) - Math.min(b.va.x, b.vb.x)
        : 0
    )
    .find(
      (a) =>
        // if there's no onward travel in either Vector
        // it's the start of a line
        getContinuingEdges({ edge: a, reverse: false }, edges).length === 0 ||
        getContinuingEdges({ edge: a, reverse: true }, edges).length === 0
    )

  if (startingEdge) {
    return {
      edge: startingEdge,
      reverse:
        getContinuingEdges({ edge: startingEdge, reverse: false }, edges)
          .length === 0,
    }
  }

  return null
}

export enum EdgeType {
  Straight,
  Curve,
  Tab,
}

interface EdgeBase {
  lSite: Site
  rSite: Site
  pos: [Vector2, Vector2]
}
interface StraightEdge {
  edgeType: EdgeType.Straight
}
interface TabEdge {
  edgeType: EdgeType.Tab
  hasWings: boolean
  flipTab: boolean
  tabPos: Vector2
  bezierPos: [Vector2, Vector2]
  anchorPos: [Vector2, Vector2]
  tabAnchorPos: [Vector2, Vector2]
}
type EdgeData = EdgeBase & (StraightEdge | TabEdge)

export const getEdgeData = ({
  edge,
  simplex,
  flipTab,
  forceStraight,
}: {
  edge: Edge
  simplex: SimplexNoise
  flipTab?: boolean
  forceStraight?: boolean
}): EdgeData => {
  const flipSign = flipTab ? 1 : -1
  const { lSite, rSite, va, vb } = edge

  const startPos = new Vector2(va.x, va.y)
  const endPos = new Vector2(vb.x, vb.y)
  const result: EdgeBase = {
    lSite,
    rSite,
    pos: [startPos, endPos],
  }

  const endVector = endPos.minusNew(startPos)
  const length = endVector.magnitude()

  if (!lSite || !rSite || length < MIN_TAB_SIZE || forceStraight) {
    return {
      ...result,
      edgeType: EdgeType.Straight,
    }
  }

  // how far anchors lean back from tab
  const leanBackAngle =
    Math.atan(
      map(
        MAX_TAB_SIZE / length,
        2,
        MIN_TAB_SIZE / MAX_TAB_SIZE,
        1 / 2,
        1 / 8,
        true
      )
    ) * flipSign

  let hasWings = length > MAX_TAB_SIZE
  let bezierStartPos = startPos.clone()
  let bezierEndPos = endPos.clone()

  if (hasWings) {
    const tabSway = map(
      simplex.noise2D(678 + lSite.voronoiId * 10, 912 + rSite.voronoiId * 10),
      -1,
      1,
      0,
      1
    )

    const endVectorUnit = endPos.minusNew(startPos).normalise()
    const wingLength = (length - MAX_TAB_SIZE) / Math.cos(leanBackAngle)

    bezierStartPos.plusEq(endVectorUnit.multiplyNew(wingLength * tabSway))
    bezierEndPos.minusEq(endVectorUnit.multiplyNew(wingLength * (1 - tabSway)))
  }

  const bezierLength = Math.min(length, MAX_TAB_SIZE)
  const bezierEndVectorUnit = bezierEndPos.minusNew(bezierStartPos).normalise()

  const tabLength = bezierLength * 0.45 * flipSign
  const tabAnchorLength = bezierLength * 1.1 // how far tab anchors are from the center
  const anchorLength = bezierLength * 0.85
  const tabAnchorAngle = map(
    simplex.noise2D(123 + lSite.voronoiId * 10, 345 + rSite.voronoiId * 10),
    -1,
    1,
    -0.3,
    0.3
  )

  const tabPos = bezierEndVectorUnit
    .multiplyNew(bezierLength / 2)
    .plusEq(bezierStartPos)
    .plusEq(bezierEndVectorUnit.multiplyNew(tabLength).rotate(-90, true))
  const tabAnchorVector = bezierEndVectorUnit
    .multiplyNew(tabAnchorLength / 2)
    .rotate(tabAnchorAngle) // tweak tab angles

  const bezierStartAnchorPos = bezierStartPos.plusNew(
    bezierEndVectorUnit.multiplyNew(anchorLength)
  )
  const tabStartAnchorPos = tabPos.minusNew(tabAnchorVector)
  const tabEndAnchorPos = tabPos.plusNew(tabAnchorVector)
  const bezierEndAnchorPos = bezierEndPos.minusNew(
    bezierEndVectorUnit.multiplyNew(anchorLength)
  )

  return {
    ...result,
    edgeType: EdgeType.Tab,
    flipTab: !!flipTab,
    hasWings,

    tabPos,

    bezierPos: [bezierStartPos, bezierEndPos],
    tabAnchorPos: [tabStartAnchorPos, tabEndAnchorPos],
    anchorPos: [bezierStartAnchorPos, bezierEndAnchorPos],
  }
}

const AVOID_POINTS_GAP = 4

export const getAvoidPointsOverLine = (start: Vector2, end: Vector2) => {
  let points: Vector2[] = []
  const vec = end.minusNew(start)
  const length = vec.magnitude()
  const unit = vec.normalise()

  for (
    let d = (length % AVOID_POINTS_GAP) / 2 + AVOID_POINTS_GAP / 2;
    d < length;
    d += AVOID_POINTS_GAP
  ) {
    points.push(unit.multiplyNew(d).plusEq(start))
  }
  return points
}

export const getAvoidPoints = (
  edgeData: EdgeData,
  dense?: boolean
): Vector2[] => {
  let points: Vector2[] = []
  const { pos } = edgeData

  const Start = 0
  const End = 1

  const vec = pos[End].minusNew(pos[Start])
  const length = vec.magnitude()
  const unit = vec.normalise()

  if (edgeData.edgeType === EdgeType.Straight) {
    for (
      let d = (length % AVOID_POINTS_GAP) / 2 + AVOID_POINTS_GAP / 2;
      d < length;
      d += AVOID_POINTS_GAP
    ) {
      points.push(unit.multiplyNew(d).plusEq(pos[Start]))
    }
    return getAvoidPointsOverLine(pos[Start], pos[End])
  }

  const { tabPos, bezierPos, anchorPos, tabAnchorPos } = edgeData

  ;[Start, End].forEach((mirror) => {
    ;[0.15, 0.8].forEach((percent) => {
      points.push(
        getCubicBezierXYatPercent(
          bezierPos[mirror],
          anchorPos[mirror],
          tabAnchorPos[mirror],
          tabPos,
          percent
        )
      )
    })
  })

  if (dense) {
    points.push(
      tabPos,
      bezierPos[Start],
      bezierPos[End],
      ...getAvoidPointsOverLine(pos[Start], bezierPos[Start]),
      ...getAvoidPointsOverLine(pos[End], bezierPos[End])
    )
  }

  return points
}
