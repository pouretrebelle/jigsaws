module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/001',
        permanent: false,
      },
    ]
  },
}
