const path = require("path");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'snm-js-0.0.1.js',
        path: path.resolve(__dirname, 'dist')
    },
    /*optimization: {
        minimizer: [new UglifyJsPlugin()],
    },*/
    mode: 'development'
};