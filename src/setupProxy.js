const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://datahub.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};