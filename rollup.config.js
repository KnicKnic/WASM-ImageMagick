import { resolve } from 'path'
import sourceMaps from 'rollup-plugin-sourcemaps'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify-es'
import { terser } from 'rollup-plugin-terser'
import { getIfUtils, removeEmpty } from 'webpack-config-utils'

import pkg from './package.json'

const env = process.env.NODE_ENV || 'development'
const { ifProduction } = getIfUtils(env)

const LIB_NAME = pkg.name
const ROOT = resolve(__dirname, '.')
const DIST = resolve(ROOT, 'dist')

/**
 * Object literals are open-ended for js checking, so we need to be explicit
 */
const PATHS = {
  entry: {
    esm5: resolve(DIST, 'esm5'),
    esm2018: resolve(DIST, 'esm2018'),
    esm6: resolve(DIST, 'esm6'),
  },
  bundles: resolve(DIST, 'bundles'),
}

function getOutputFileName(fileName, isProd = false) {
  return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}

const external = Object.keys(pkg.peerDependencies || {}) || []

const plugins = ([
  // Allow json resolution
  json(),

  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),

  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  // https://github.com/rollup/rollup-plugin-node-resolve#usage
  nodeResolve(),

  // Resolve source maps to the original source
  sourceMaps(),

  // properly set process.env.NODE_ENV within `./environment.ts`
  replace({
    exclude: 'node_modules/**',
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
])

const CommonConfig = {
  input: {},
  output: {},
  inlineDynamicImports: true,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external,
}

import babel from 'rollup-plugin-babel';
const UMDEs5config = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm5, 'index.js'),

  output: {
    file: getOutputFileName(
      resolve(PATHS.bundles, `${pkg.name}.umd-es5.js`),
      ifProduction()
    ),
    format: 'umd',
    name: LIB_NAME,
    sourcemap: true,
    amd: {
      id: 'wasm-imagemagick'
    }
  },
  plugins: removeEmpty(([...plugins, ifProduction(uglify()), babel({
    include: 'node_modules/**', babelrc: false, presets: [
      [
        "@babel/preset-env",
        {
          "targets": "ie 10"
        }
      ]
    ]
  })])
  ),
}

const UMDEs6config = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm5, 'index.js'),
  output: {
    file: getOutputFileName(
      resolve(PATHS.bundles, `${pkg.name}.umd-es6.js`),
      ifProduction()
    ),
    format: 'umd',
    name: LIB_NAME,
    sourcemap: true,
  },
  plugins: removeEmpty(([...plugins, ifProduction(uglify())])
  ),
}



const FESMEs5config = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm5, 'index.js'),
  output: [
    {
      file: getOutputFileName(
        resolve(PATHS.bundles, `${pkg.name}.esm-es5.js`),
        ifProduction()
      ),
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: removeEmpty(
    ([...plugins, ifProduction(terser()), babel({
      include: 'node_modules/**', babelrc: false, presets: [
        [
          "@babel/preset-env",
          {
            "targets": "ie 10"
          }
        ]
      ]
    })])
  ),
}

const FESMEs6config = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm6, 'index.js'),
  output: [
    {
      file: getOutputFileName(
        resolve(PATHS.bundles, `${pkg.name}.esm-es6.js`),
        ifProduction()
      ),
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: removeEmpty(
    ([...plugins, ifProduction(terser())])
  ),
}

const FESMEs2018config = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm2018, 'index.js'),
  output: [
    {
      file: getOutputFileName(
        resolve(PATHS.bundles, `${pkg.name}.esm-es2018.js`),
        ifProduction()
      ),
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: removeEmpty(
    ([...plugins, ifProduction(terser())])
  ),
}

export default [
  UMDEs5config,
  UMDEs6config,
  FESMEs5config,
  FESMEs6config,
  FESMEs2018config
]

