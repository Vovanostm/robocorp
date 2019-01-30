module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
  },
};
