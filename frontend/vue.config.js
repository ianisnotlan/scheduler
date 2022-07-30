module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/static/dist/' : '/',
  outputDir: '../src/static/dist',
  indexPath: '../../templates/vue.html',
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:8000/',
      },
    },
  },
}
