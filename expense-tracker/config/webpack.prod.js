const path = require("path");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const CopyPlugin = require("copy-webpack-plugin");
const packageJson = require("../package.json");
const commonConfig = require("./webpack.common");

const buildToFirebase = process.env.BUILD_TO_FIREBASE;

// PWA files must be served at the origin root so the service worker can control all pages.
// When building for Firebase, firebase-public/ is the root; otherwise write next to the bundle.
const pwaDestDir = buildToFirebase
  ? path.resolve(__dirname, "../../firebase-public")
  : path.resolve(__dirname, "../dist");

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
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "../public/manifest.json"), to: path.join(pwaDestDir, "manifest.json") },
        { from: path.resolve(__dirname, "../public/service-worker.js"), to: path.join(pwaDestDir, "service-worker.js") },
        { from: path.resolve(__dirname, "../public/icons"), to: path.join(pwaDestDir, "icons") },
      ],
    }),
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
