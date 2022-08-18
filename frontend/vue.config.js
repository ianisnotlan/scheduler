module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/static/dist/' : '/',
  outputDir: '../src/static/dist',
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:8000/',
      },
    },
  },
}
