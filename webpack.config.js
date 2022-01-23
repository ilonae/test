const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(__dirname, "public"),
    entry: ["regenerator-runtime/runtime.js", "../src/index.tsx"],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                include: /(src)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    "useBuiltIns": "usage",
                                    "corejs": 3
                                }
                            ],
                            ['@babel/preset-typescript', { allowNamespaces: true }]
                        ],
                        plugins: [
                            '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                }]
            },
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "src"),
                use: [{
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            }
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_BASENAME': JSON.stringify(process.env.REACT_APP_BASENAME),
        })
    ],
};