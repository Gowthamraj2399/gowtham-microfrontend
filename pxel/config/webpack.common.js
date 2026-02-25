const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectRoot = path.resolve(__dirname, "..");
require("dotenv").config({ path: path.join(projectRoot, ".env") });
require("dotenv").config({ path: path.join(projectRoot, ".env.local") });

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "@": projectRoot,
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react', 
              '@babel/preset-env',
              '@babel/preset-typescript'
            ],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|pdf)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.EnvironmentPlugin({
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: "",
      VITE_CLOUDINARY_CLOUD_NAME: "",
      VITE_CLOUDINARY_UPLOAD_PRESET: "",
      GEMINI_API_KEY: "",
    }),
  ],
};
