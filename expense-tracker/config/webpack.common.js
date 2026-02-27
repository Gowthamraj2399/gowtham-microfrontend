const path = require("path");
const webpack = require("webpack");

// Load .env from expense-tracker folder so DefinePlugin can inject into the bundle
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env.VITE_SUPABASE_URL || ""
      ),
      "process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY": JSON.stringify(
        process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ""
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};
