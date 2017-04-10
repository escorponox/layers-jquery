import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default (env = {dev: true}) => {

  return {
    context: path.join(__dirname, 'app'),
    entry: {
      app: './scripts/app.js',
      vendor: ['jquery']
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.[hash].js'
    },
    devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, './dist/'),  // New
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
            }
          ]
        },
        env.dev ? {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  autoprefixer({
                    browsers: 'last 1 chrome version'
                  })
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        } : {
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: ExtractTextPlugin.extract([
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer({
                    browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']
                  }),
                  cssnano
                ]
              }
            },
            {
              loader: 'sass-loader',
            }
          ])
        }
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body',
        minify: env.prod ? {
          collapseWhitespace: true,
          conservativeCollapse: true
        } : false,
      }),
      env.prod ? new ExtractTextPlugin({
        filename: '[name].bundle.[hash].css',
        disable: false,
        allChunks: true
      }) : undefined,
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      })

    ].filter(p => !!p)
  }
}