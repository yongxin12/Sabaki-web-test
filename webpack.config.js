const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

let noopPath = path.join(__dirname, 'src/modules/shims/noop')
let emptyPath = path.join(__dirname, 'src/modules/shims/empty')

module.exports = (env, argv) => ({
  entry: './src/components/App.js',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    clean: true
  },

  devtool: argv.mode === 'production' ? false : 'eval-cheap-module-source-map',
  target: 'web',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    open: true,
    hot: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { pragma: 'h', pragmaFrag: 'Fragment' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|mp3)$/i,
        type: 'asset/resource'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.platform': JSON.stringify('web'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.versions': JSON.stringify({}),
      'process.browser': JSON.stringify(true)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'style', to: 'style' },
        { from: 'data', to: 'data' },
        { from: 'img', to: 'img' },
        { from: 'build/icon.ico', to: 'build/icon.ico' },
        { from: 'src/manifest.json', to: 'src/manifest.json' },
        { from: 'node_modules/@primer/octicons/build/svg', to: 'node_modules/@primer/octicons/build/svg' },
        { from: 'node_modules/@sabaki/deadstones/wasm', to: 'node_modules/@sabaki/deadstones/wasm' },
        { from: 'node_modules/@sabaki/shudan/css', to: 'node_modules/@sabaki/shudan/css' },
        { from: 'node_modules/pikaday/css', to: 'node_modules/pikaday/css' }
      ]
    })
  ],

  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',

      // Web-specific shims
      'electron': path.join(__dirname, 'src/modules/shims/electron'),
      '@electron/remote': path.join(__dirname, 'src/modules/shims/electron-remote'),
      'fs': path.join(__dirname, 'src/modules/shims/fs'),
      'util': 'util',
      'path': 'path-browserify',
      'fix-path': noopPath,
      'rimraf': noopPath,
      'argv-split': noopPath,
      'winston': emptyPath,
      '@sabaki/gtp': emptyPath,

      // Module-specific shims
      '../modules/enginesyncer': emptyPath,
      './i18n': path.join(__dirname, 'src/modules/shims/i18n'),
      '../i18n': path.join(__dirname, 'src/modules/shims/i18n'),
      '../../i18n': path.join(__dirname, 'src/modules/shims/i18n'),
      '../menu': emptyPath,

      // Component shims for features not available in web
      './ThemeManager': path.join(__dirname, 'src/modules/shims/ThemeManager'),
      './GtpConsole': noopPath,
      './TextSpinner': noopPath,
      '../TextSpinner': noopPath,
      './drawers/AdvancedPropertiesDrawer': noopPath,
      './drawers/PreferencesDrawer': noopPath,
      './drawers/CleanMarkupDrawer': noopPath,
      './bars/AutoplayBar': noopPath,
      './bars/GuessBar': noopPath
    },
    fallback: {
      "buffer": false,
      "crypto": false,
      "events": require.resolve("events/"),
      "stream": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "process": false
    }
  },

  externals: {
    'cross-spawn': 'null',
    moment: 'null'
  }
})
