const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('node:path');

module.exports = (env, argv) => {
  return {
    entry: path.join(__dirname, 'src', 'index.tsx'),
    cache: argv.mode == 'development' ? false : true,
    devtool: argv.mode == 'development' ? 'inline-source-map' : 'eval',
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(svg)$/,
          use: 'file-loader',
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /\.module\.scss$/,
        },
        {
          test: /\.module\.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: argv.mode == 'development' ? '[path][name]__[local]' : '[hash:base64]',
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'index.html'),
      }),
      new CopyPlugin({
        patterns: [{ from: path.join(__dirname, 'public') }],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    devServer: {
      port: 9000,
      hot: true,
      static: {
        directory: path.join(__dirname, 'public'),
      },
    },
  };
};
