var path    = require('path'),
    webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, '/client'),
    entry: './index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.min.js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true, sourceMap: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true)
    ]
}