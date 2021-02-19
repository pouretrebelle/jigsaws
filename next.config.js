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
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
}
