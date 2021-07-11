import Vector2 from './Vector2'

export const getMinDistBetweenPointSets = (
  a: Vector2[],
  b: Vector2[]
): number =>
  b.reduce(
    (min, pointB) =>
      Math.min(
        min,
        a.reduce((min, pointA) => Math.min(min, pointB.dist(pointA)), Infinity)
      ),
    Infinity
  )

/**
 * https://stackoverflow.com/a/17096947
 */
export const getCubicBezierXYatPercent = (
  start: Vector2,
  control1: Vector2,
  control2: Vector2,
  end: Vector2,
  percent: number
): Vector2 => {
  const x = cubicN(percent, start.x, control1.x, control2.x, end.x)
  const y = cubicN(percent, start.y, control1.y, control2.y, end.y)
  return new Vector2(x, y)
}
const cubicN = (
  pct: number,
  a: number,
  b: number,
  c: number,
  d: number
): number => {
  const t2 = pct * pct
  const t3 = t2 * pct
  return (
    a +
    (-a * 3 + pct * (3 * a - a * pct)) * pct +
    (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
    (c * 3 - c * 3 * pct) * t2 +
    d * t3
  )
}

/**
 * https://stackoverflow.com/a/17096947
 */
export const getQuadraticBezierXYatPercent = (
  start: Vector2,
  control: Vector2,
  end: Vector2,
  percent: number
): Vector2 => {
  const x =
    Math.pow(1 - percent, 2) * start.x +
    2 * (1 - percent) * percent * control.x +
    Math.pow(percent, 2) * end.x
  const y =
    Math.pow(1 - percent, 2) * start.y +
    2 * (1 - percent) * percent * control.y +
    Math.pow(percent, 2) * end.y
  return new Vector2(x, y)
}
