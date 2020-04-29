class Vector2 {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  reset = (x: number, y: number) => {
    this.x = x
    this.y = y
    return this
  }

  toString = (decPlaces: number): string => {
    decPlaces = decPlaces || 3
    const scalar = Math.pow(10, decPlaces)
    return `${Math.round(this.x * scalar) / scalar}, ${
      Math.round(this.y * scalar) / scalar
    }]`
  }

  clone = () => {
    return new Vector2(this.x, this.y)
  }

  copyTo = (v: Vector2) => {
    v.x = this.x
    v.y = this.y
  }

  copyFrom = (v: Vector2) => {
    this.x = v.x
    this.y = v.y
  }

  magnitude = () => {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  magnitudeSquared = () => {
    return this.x * this.x + this.y * this.y
  }

  normalise = () => {
    const m = this.magnitude()
    this.x = this.x / m
    this.y = this.y / m
    return this
  }

  reverse = () => {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  plusEq = (v: Vector2) => {
    this.x += v.x
    this.y += v.y
    return this
  }

  plusNew = (v: Vector2) => {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  minusEq = (v: Vector2) => {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  minusNew = (v: Vector2) => {
    return new Vector2(this.x - v.x, this.y - v.y)
  }

  multiplyEq = (scalar: number) => {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  multiplyNew = (scalar: number) => {
    const returnvec = this.clone()
    return returnvec.multiplyEq(scalar)
  }

  divideEq = (scalar: number) => {
    this.x /= scalar
    this.y /= scalar
    return this
  }

  divideNew = (scalar: number) => {
    const returnvec = this.clone()
    return returnvec.divideEq(scalar)
  }

  dot = (v: Vector2) => {
    return this.x * v.x + this.y * v.y
  }

  angle = (useDegrees: boolean) => {
    return (
      Math.atan2(this.y, this.x) * (useDegrees ? Vector2Const.TO_DEGREES : 1)
    )
  }

  rotate = (angle: number, useDegrees: boolean) => {
    const cosRY = Math.cos(angle * (useDegrees ? Vector2Const.TO_RADIANS : 1))
    const sinRY = Math.sin(angle * (useDegrees ? Vector2Const.TO_RADIANS : 1))
    Vector2Const.temp.copyFrom(this)
    this.x = Vector2Const.temp.x * cosRY - Vector2Const.temp.y * sinRY
    this.y = Vector2Const.temp.x * sinRY + Vector2Const.temp.y * cosRY
    return this
  }

  equals = (v: Vector2) => {
    return this.x === v.x && this.y === v.y
  }

  isCloseTo = (v: Vector2, tolerance: number) => {
    if (this.equals(v)) return true
    Vector2Const.temp.copyFrom(this)
    Vector2Const.temp.minusEq(v)
    return Vector2Const.temp.magnitudeSquared() < tolerance * tolerance
  }

  rotateAroundPoint = (point: Vector2, angle: number, useDegrees: boolean) => {
    Vector2Const.temp.copyFrom(this)
    Vector2Const.temp.minusEq(point)
    Vector2Const.temp.rotate(angle, useDegrees)
    Vector2Const.temp.plusEq(point)
    this.copyFrom(Vector2Const.temp)
  }

  isMagLessThan = (distance: number) => {
    return this.magnitudeSquared() < distance * distance
  }

  isMagGreaterThan = (distance: number) => {
    return this.magnitudeSquared() > distance * distance
  }

  dist = (v: Vector2) => {
    return this.minusNew(v).magnitude()
  }
}

const Vector2Const = {
  TO_DEGREES: 180 / Math.PI,
  TO_RADIANS: Math.PI / 180,
  temp: new Vector2(),
}

export default Vector2
