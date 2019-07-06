// import SimplexNoise from 'simplex-noise'

const cut = ({ c, width }) => {
  c.beginPath()

  c.moveTo(0, 0)
  c.lineTo(width, width)

  c.stroke()
}

export default cut
