const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.optimize.CommonsChunkPlugin({name: ['vendor','manifest']}),

    new HtmlWebpackPlugin({
      template: '../index.html'
    })
];

var rules = [
  {
    test: /\.(js|jsx)$/,
    use: [
        'babel-loader'
    ],
    exclude: /node_modules/
  },
  {
    test: /\.(woff(2)?|ttf|eot|svg)(\?[a-z0-9]+)?$/,
    use: "url-loader?limit=10000&name=fonts/[name].[ext]"
  },
  {
    test: /\.(jpg|png)(\?[a-z0-9]+)?$/,
    use: [
          "file-loader?name=images/[name].[ext]",
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {quality: 80}
            }
          }
        ]
  },
  {
    test: /\.mp4$/,
    use: 'url-loader?limit=10000&mimetype=video/mp4'
  },
  {
    test: /\.webm$/,
    use: 'url-loader?limit=10000&mimetype=video/webm'
  },
  {
    test: /\.ogv$/,
    use: 'url-loader?limit=10000&mimetype=video/ogv'
  }
];

if ('production' == process.env.NODE_ENV) {
  plugins.push(new ExtractTextPlugin({filename: 'css/style.[contenthash].css'}))
  rules.push({
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader?importLoaders=1&minimize=true&sourceMap!postcss-loader!sass-loader?sourceMap'
    })
  })
} else {
  rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap']
  })
}

module.exports = {
    entry: {
      app: ['babel-polyfill', './src/jsx/app.jsx'],
      vendor: [ 'react', 'react-dom', 'react-router', 'react-router-dom', 'rxjs', 'react-transition-group'],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: '/'
    },
    externals: {
      'jquery': 'jQuery'
    },
    // context: resolve(__dirname, 'src'),

    devtool: 'production' == process.env.NODE_ENV ? false : 'inline-source-map',

    devServer: {
        hot: true,
        // enable HMR on the server
        // noInfo: true,
        // stats: "errors-only",
        contentBase: resolve(__dirname, 'dist'),
        // match the output path

        publicPath: '/',
        // match the output `publicPath`

        //fallback to root for other urls
        historyApiFallback: true
    },

    module: {
        rules
    },

    plugins,

};
