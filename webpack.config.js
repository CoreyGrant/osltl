require('./server/nodeenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
var fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");
var nodeEnv = process.env.NODE_ENV;
var isProduction = nodeEnv === "production";
const exp = {
    mode: nodeEnv,
    entry: './js/index.tsx',
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
          { from: "images", to: "images" },
          { from: 'favicon.ico'},
          { from: 'css', to: 'css'}
        ],
      }),
    ],
    devServer: false
  };
if(!isProduction){
  exp.devtool = 'inline-source-map';
}
  module.exports = exp;