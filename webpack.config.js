const path = require('path');
const webpack = require('webpack');
const SRC = path.resolve(__dirname, 'src');
const DEST = path.resolve(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: SRC + '/index.js',
    resolve: {
        modules: [__dirname, 'node_modules'],
        extensions: ["*", ".js", ".jsx"]
    },
    output: {
        path: DEST,
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['env', 'react']
                }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    'url-loader?limit=100000'
                ]
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                use: [
                    'url-loader'
                ]
            }
        ]
    }
};