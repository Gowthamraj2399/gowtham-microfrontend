const { merge } = require("webpack-merge");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const commonConfig = require("./webpack.common");
const packageJson = require("../package.json");

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: "production",
  output: {
    filename: "[name].[contenthash].js",
    publicPath: "/container/latest/",
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
          requiredVersion: packageJson.dependencies.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: packageJson.dependencies["react-dom"],
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
