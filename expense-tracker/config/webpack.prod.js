const path = require("path");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("../package.json");
const commonConfig = require("./webpack.common");

const buildToFirebase = process.env.BUILD_TO_FIREBASE;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/expensetracker/latest/",
    ...(buildToFirebase && {
      path: path.resolve(__dirname, "../../firebase-public/expensetracker/latest"),
    }),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "expensetracker",
      filename: "remoteEntry.js",
      exposes: {
        "./ExpenseTrackerApp": "./src/bootstrap",
      },
      shared: {
        ...packageJson.dependencies,
        react: {
          singleton: true,
          requiredVersion: "19.0.0",
          strictVersion: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "19.0.0",
          strictVersion: true,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-router-dom"],
        },
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
