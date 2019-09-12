// import SimplexNoise from 'simplex-noise'

const cut = ({ c, width, height }) => {
  c.beginPath()

  c.moveTo(0, 0)
  c.lineTo(width, height)

  c.stroke()
}

export default cut
