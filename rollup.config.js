import { resolve } from 'path'
import sourceMaps from 'rollup-plugin-sourcemaps'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import  uglify  from 'rollup-plugin-uglify-es'
import { terser } from 'rollup-plugin-terser'
import { getIfUtils, removeEmpty } from 'webpack-config-utils'

import pkg from './package.json'

const env = process.env.NODE_ENV || 'development'
const { ifProduction } = getIfUtils(env)

const LIB_NAME = pascalCase(normalizePackageName(pkg.name))
const ROOT = resolve(__dirname, '.')
const DIST = resolve(ROOT, 'dist')

/**
 * Object literals are open-ended for js checking, so we need to be explicit
 */
const PATHS = {
  entry: {
    esm5: resolve(DIST, 'esm5'),
    esm2018: resolve(DIST, 'esm2018'),
  },
  bundles: resolve(DIST, 'bundles'),
}


// helpers

function dashToCamelCase(myStr) {
  return myStr.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

function toUpperCase(myStr) {
  return `${myStr.charAt(0).toUpperCase()}${myStr.substr(1)}`
}

function pascalCase(myStr) {
  return toUpperCase(dashToCamelCase(myStr))
}

function normalizePackageName(rawPackageName) {
  const scopeEnd = rawPackageName.indexOf('/') + 1

  return rawPackageName.substring(scopeEnd)
}

function getOutputFileName(fileName, isProd = false) {
  return isProd ? fileName.replace(/\.js$/, '.min.js') : fileName
}





const external = Object.keys(pkg.peerDependencies||{}) || []

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

const UMDconfig = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm5, 'index.js'),
  output: {
    file: getOutputFileName(
      resolve(PATHS.bundles, `${LIB_NAME}.umd-es5.js`),
      ifProduction()
    ),
    format: 'umd',
    name: LIB_NAME,
    sourcemap: true,
  },
  plugins: removeEmpty(([...plugins, ifProduction(uglify())])
  ),
}

const FESMconfig = {
  ...CommonConfig,
  input: resolve(PATHS.entry.esm2018, 'index.js'),
  output: [
    {
      file: getOutputFileName(
        resolve(PATHS.bundles, `${LIB_NAME}.esm-es2018.js`),
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

export default [UMDconfig
  , FESMconfig
]

