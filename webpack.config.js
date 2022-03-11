// see https://www.figma.com/plugin-docs/bundling-webpack/
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const postcssNormalize = require("postcss-normalize");
const { DefinePlugin } = require("webpack");

const BROWSERS =
  "last 5 chrome versions, last 5 firefox versions, last 1 safari major version";

module.exports = (env, argv) => {
  const isEnvProduction = argv.mode === "production";
  const isEnvDevelopment = !isEnvProduction;

  return {
    mode: isEnvProduction ? "production" : "development",

    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: isEnvDevelopment && "inline-source-map",

    entry: {
      ui: ["./src/index.tsx"],
    },

    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|jsx|ts|tsx)$/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env",
                      {
                        targets: BROWSERS,
                      },
                    ],
                    "@babel/preset-react",
                    "@babel/preset-typescript",
                  ],
                },
              },
            },
            {
              test: /\.s?css$/,
              use: [
                "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 3,
                    sourceMap: true,
                  },
                },
                {
                  // Adds vendor prefixing based on your specified browser support in
                  // package.json
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      // Necessary for external CSS imports to work
                      // https://github.com/facebook/create-react-app/issues/2677
                      ident: "postcss",
                      plugins: () => [
                        require("postcss-flexbugs-fixes"),
                        require("postcss-preset-env")({
                          autoprefixer: {
                            flexbox: "no-2009",
                          },
                          browsers: BROWSERS,
                          stage: 3,
                        }),
                        // Adds PostCSS Normalize as the reset css with default options,
                        // so that it honors browserslist config in package.json
                        // which in turn let's users customize the target behavior as per their needs.
                        postcssNormalize(),
                      ],
                    },
                    sourceMap: true,
                  },
                },
                {
                  loader: "resolve-url-loader",
                  options: {
                    root: path.resolve(__dirname, "src"),
                    sourceMap: true,
                  },
                },
                {
                  loader: "sass-loader",
                  options: {
                    sourceMap: true,
                  },
                },
              ],
            },
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              // all assets need to be inline for Figma plugins
              type: "asset/inline",
            },
          ],
        },
      ],
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      modules: ["node_modules"],
    },

    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"), // Compile into a folder called "dist"
      publicPath: "/",
    },

    // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
    plugins: [
      new HtmlWebpackPlugin({
        cache: false,
        chunks: ["ui"],
        filename: "./ui.html",
        inject: "body",
        template: "./src/ui.html",
      }),
      new DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isEnvProduction ? "production" : "debug"
        ),
      }),
      new HtmlInlineScriptPlugin([/^ui\.js$/]),
    ],
  };
};
