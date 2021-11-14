// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: "development",
  // plugins: [
  //   new BundleAnalyzerPlugin()
  // ],
  entry: {
    home: {
      import: ["@babel/polyfill", "./src/modules/home/home.jsx"],
    },
    login: ["@babel/polyfill", "./src/modules/login/login.jsx"],
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/src/dist",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          chunks: "initial",
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
};
