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

 * emcc update to 1.38.20
 * call() resolves with more info: commands, inputFiles
 * utils: isImage, buildImageSrc, loadImageElement optionally output to browser compatible formats
 * wasm build can be done locally if emscripten is installed ```export BUILD_WASM_LOCAL=-local && npm run build```
 * more format tests and support information: knownSupportedReadWriteImageFormats, knownSupportedWriteOnlyImageFormats, knownSupportedReadOnlyImageFormats. formats demo. 
 * string commands syntax support for:
   * bash comment lines starting with `#`
   * virtual command for shell substitution with backquote. See next examples:
   * virtual command: ls with support for wildcards (globs) : ``convert `ls foo/**/bar*.png` o.gif``
   * virtual command: cat with support for wildcards (globs) : ``convert in.png -fill `cat out2.txt` foo.gif``
   * virtual command: buildInputFile: ``convert `buildInputFile fn.png` -rotate 22 out.gif``
   * virtual command uniqueName: ``convert rose: -rotate 22 `uniqueName`.gif``
