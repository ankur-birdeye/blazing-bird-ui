const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");
const config = require("./webpack.config.base");

const GLOBALS = {
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
};

module.exports = merge(config, {
  debug: false,
  devtool: "cheap-module-source-map",
  entry: {
    application: "production",
    vendor: ["react", "react-dom", "react-redux", "react-router", "redux"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "../src/client/assets/images"),
        to: "images"
      }
    ]),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ExtractTextPlugin({
      filename: "css/app.css",
      allChunks: true
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|html)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      // Sass
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, "../src")],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style",
          loader: [
            { loader: "css", query: { sourceMap: true } },
            "postcss",
            { loader: "sass", query: { outputStyle: "compressed" } }
          ]
        })
      },
      // Sass + CSS Modules
      // {
      //   test: /\.scss$/,
      //   include: /src\/client\/assets\/javascripts/,
      //   loader: ExtractTextPlugin.extract({
      //     fallbackLoader: 'style',
      //     loader: [
      //       {
      //         loader: 'css',
      //         query: {
      //           modules: true,
      //           importLoaders: 1,
      //           localIdentName: '[path][name]__[local]--[hash:base64:5]'
      //         }
      //       },
      //       'postcss',
      //       { loader: 'sass', query: { outputStyle: 'compressed' } }
      //     ]
      //   })
      // },
      // CSS
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style",
          loader: ["css", "postcss"]
        })
      }
    ]
  }
});
