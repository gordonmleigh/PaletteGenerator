import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import builtin from "builtin-modules";
import { terser } from "rollup-plugin-terser";

const ignoreModules = [];
const noBundle = [...builtin];
const DEBUGGING = !!process.env.DEBUG_BUILD;

export default {
  input: "src/host/index.ts",

  output: {
    file: "dist/plugin.js",
    format: "cjs",
    sourcemap: true,
    plugins: [
      getBabelOutputPlugin({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "ie 11",
            },
          ],
        ],
      }),
    ],
  },

  plugins: [
    resolve({
      exportConditions: ["node"],
    }),
    typescript(),
    commonjs({
      ignore: ignoreModules,
    }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify(
          DEBUGGING ? "debug" : "production"
        ),
      },
    }),
    !DEBUGGING &&
      terser({
        output: {
          comments: false,
        },
      }),
  ].filter(Boolean),

  external: (id) => noBundle.includes(id),
};
