var webpack = require('webpack');
var path = require('path');
var noop = function() { /* */ };

module.exports = function(env) {
    return {
        entry: path.resolve('src/js/main.js'),
        output: {
            path: path.resolve(__dirname, 'assets/js'),
            filename: '[name].js'
        },
        externals: {
            // require("jquery") is external and available
            // on the global var jQuery
            'jquery': 'jQuery'
        },
        watch: (env !== 'production'),
        cache: true,
        devtool: (env === 'production') ? false : 'eval',
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: module => /node_modules/.test(module.resource)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'jQuery': 'jquery',
                'window.jQuery': 'jquery'
            }),
            (env === 'production') ? new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }) : noop,
            (env === 'production') ? new webpack.optimize.UglifyJsPlugin() : noop
        ],
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules|bower_components|vendor/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }, {
                test: /\.js$/,
                exclude: /node_modules|bower_components|vendor/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        fix: true
                    }
                },
                enforce: 'pre'
            }]
        }
    };
};
