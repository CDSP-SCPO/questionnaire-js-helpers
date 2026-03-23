const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'style')
        ],
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/i,
      //   include: [path.resolve(__dirname, 'src')],
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]',
      //     outputPath: 'assets'
      //   }
      // }
    ]
  },
  output: {
    publicPath: '/',
    filename: 'questionnaire-helpers.bundled.js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
    library: {
      name: 'questionnaireHelpers',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.css', '.scss', '.js', '.jsx', '.ts', '.tsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    static: [
      { directory: path.resolve(__dirname, 'dist') },
      { directory: path.resolve(__dirname, 'public') }
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true
      }
    },
    port: 9080,
    hot: true
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
