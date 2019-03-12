var path = require('path');
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "document-converting-service.js",
    library: "DocumentConvertingService",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  watch: true,
  devtool: 'source-map'
}
