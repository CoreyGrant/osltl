const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './js/index.tsx',
    devtool: 'inline-source-map',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
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
        template: './index.html'
      }),
      new CopyPlugin({
        patterns: [
          { from: "icon", to: "icon" },
        ],
      }),
    ],
    devServer:{
      client:{
        overlay: false
      }
    }
  };