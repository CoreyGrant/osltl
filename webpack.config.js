const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
var fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './js/index.tsx',
    devtool: 'inline-source-map',
    output: {
      filename: '[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        templateContent: fs.readFileSync('./index.html', {encoding: 'utf8'}).replace(/\.css\?v=1/g, ".css?v=" + Date.now()),
        hash: true
      }),
      new CopyPlugin({
        patterns: [
          { from: "icon", to: "icon" },
          { from: 'favicon.ico'},
          { from: 'css', to: 'css'}
        ],
      }),
    ],
    devServer: false
  };