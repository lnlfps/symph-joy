const withCss = require('@symph/joy-css')
const withLess = require('@symph/joy-less')
const withImageLoader = require('@symph/joy-image')

module.exports = {
  serverRender: true,
  plugins: [
    withCss(),
    withLess({cssModules: true}),
    withImageLoader({limit: 8192})
  ],
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/', query: { title: 'basic example' } },
    }
  },
  webpack (config, options) {
    return config
  }
}
