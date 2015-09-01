var path = require('path');

module.exports = {
  entry: './src/app.jsx',
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      },
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "src/sass")
        ],
        loader: 'style!css!sass'
      }
    ]
  },
};
