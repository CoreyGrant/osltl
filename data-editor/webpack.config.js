const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const exp = {
    mode: 'development',
    entry: './index.tsx',
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
    //   new CopyPlugin({
    //     patterns: [
    //     ],
    //   }),
    ],
    devServer: false
  };

  exp.devtool = 'inline-source-map';

  module.exports = exp;