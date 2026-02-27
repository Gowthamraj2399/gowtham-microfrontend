const path = require("path");
const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("../package.json");

const buildToFirebase = process.env.BUILD_TO_FIREBASE;
const domain = process.env.PRODUCTION_DOMAIN || "";

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    ...(buildToFirebase
      ? {
          path: path.resolve(__dirname, "../../firebase-public"),
          publicPath: "/",
        }
      : { publicPath: "/container/latest/" }),
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      remotes: {
        portfolio: `portfolio@${domain}/portfolio/latest/remoteEntry.js`,
        auth: `auth@${domain}/auth/latest/remoteEntry.js`,
        expensetracker: `expensetracker@${domain}/expensetracker/latest/remoteEntry.js`,
        pxel: `pxel@${domain}/pxel/latest/remoteEntry.js`,
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
