# Changelog

## 1.1.0

 * basic node.js project
 * fix [RuntimeError: float unrepresentable in integer range](https://github.com/KnicKnic/WASM-ImageMagick/issues/12)
 * azure-pipelines using npm 

## 1.1.1

 * source code ported to TypeScript
 * Types for input files, output files

## 1.2.0

 * src/util with utilities for 
   * working with magick files, 
   * html images/input elements, 
   * image compare, 
   * extract information, 
   * command line string to `Call()` array conversion utility
 * `execute()` high level function
 * `ImageContext` and `ImageHome` auxiliary classes
 * jasmine specs that runs in chrome (puppeteer)
 * tslint
 * `spec/formatSpec.ts` to test all supported formats 
 * new low level `call()` function that resolves with more information: stdout, stderr, exitCode
 * extractInfo() return value  typings 
 * interactive execution context sample
 * high level apis support for built in images
 * npm test now execute both node and browser tests
 * new call() low level function that resolves with stdout, stderr, exitCode (solves https://github.com/KnicKnic/WASM-ImageMagick/issues/11)
 * src/list contains  enums for "convert list" values - auto-generated using scripts/generateImEnums.ts
 * npm run bundle generate bundle files that can be imported as js estandard modules or UMD - magickApi.js is one of these. uses rollup tool
 * apidocs using typedoc to generate markdown - published in /apidocs and linked in readme - see [apidocs](https://github.com/KnicKnic/WASM-ImageMagick/tree/sample-sinteractive-/apidocs)
 * getPixelColor
 * dependencies updated (most importantly gulp 4)

 
## 1.2.1

 * First automated release

## 1.2.2

 * Support auto discovery of magick.js & magick.wasm files
   * Allows simple usage in CDNs

## 1.2.4

Publish fix'd npm package

## 1.2.5

Undo publish of above

## 1.2.6

fix using let breaking web worker https://github.com/KnicKnic/WASM-ImageMagick/issues/56

## 1.2.7

use published container for build, rather than build container image every time (updated utilities were failing build)

## 1.2.8

* fix [Execute fails with 'TypeError: Cannot read property 'buffer' of undefined [...]'](https://github.com/KnicKnic/WASM-ImageMagick/issues/51)
* fix [Uncaught TypeError: Cannot read property 'getSync' of undefined](https://github.com/KnicKnic/WASM-ImageMagick/issues/53)
* fixed webworker location lookup code to fail to same directory on webserver (instead of failing)
* fix docs - updated basic playground url
