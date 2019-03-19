const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: {
    background: './src/app/background/index.ts',
    contentscriptmenu: './src/app/contentscript/menu/index.ts',
    contentscriptchart: './src/app/contentscript/chart/index.ts',
  },
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // evalをデフォルトで使用する設定になっているようで、これがChromeを怒らせた原因。
  // ref. http://eiua-memo.tumblr.com/post/172719308488/chromeextension-unsafe-eval-%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E8%A7%A3%E6%B1%BA%E6%96%B9%E6%B3%95 {
  devtool: 'cheap-module-source-map',
  // }
  module: {
    rules: [
      {
        test: /\.(ts|vue)$/,
        include: [path.resolve(__dirname, 'src/app')],
        enforce: 'pre',
        loader: './tslint-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      // ref. https://vue-loader.vuejs.org/guide/#manual-setup
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // ref. https://vue-loader.vuejs.org/guide/pre-processors.html#sass
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      // ref. https://vue-loader.vuejs.org/guide/pre-processors.html#sass-vs-scss
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true,
            },
          },
        ],
      },
      // ref. https://vue-loader.vuejs.org/guide/css-modules.html#usage
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              // enable CSS Modules
              modules: true,
              // customize generated class names
              localIdentName: '[local]_[hash:base64:8]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@infrastructure': path.resolve(__dirname, 'src/app/infrastructure'),
      '@contentscript': path.resolve(__dirname, 'src/app/contentscript'),
      '@domain': path.resolve(__dirname, 'src/app/domain'),
    },
  },
  plugins: [new VueLoaderPlugin()],
};
