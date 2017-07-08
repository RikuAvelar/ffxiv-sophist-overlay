const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    entry: __dirname + "/src/index.es6.js",
    output: {
        path: __dirname + '/dist',
        filename: "index.js"
    },
    plugins: [
              new HtmlWebpackPlugin({
                title: 'Overlay',
                filename: 'output.html',
                inlineSource: '.(js|css)$' // embed all javascript and css inline
              })
          ],
    module: {
        loaders: [
            { test: /\.css$/,
                use: [ 'style-loader', 'css-loader',
                'font-loader' ]},
            { test: /\.es6\.js$/, loader: 'babel-loader' }
        ]
    }
};