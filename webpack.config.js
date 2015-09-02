var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var minifiedReact = path.resolve(node_modules, 'react/dist/react.min.js');

module.exports = {
  entry: ['webpack/hot/dev-server', './src/app.jsx'],

  // Use minified react for quicker rebundling.
  // No propTypes type validation. Also lose error messages
  // resolve: {
  //   alias: {
  //     'react': minifiedReact
  //   }
  // },

  output: {
    path: path.resolve(__dirname, 'build'),
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
    ],

    // stop webpack from parsing the minified file
    // noParse: [minifiedReact]
  },

};
