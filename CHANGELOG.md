# Changelog

## 1.1.0

 * basic node.js project
 * fix [RuntimeError: float unrepresentable in integer range](https://github.com/KnicKnic/WASM-ImageMagick/issues/12)
 * azure-pipelines using npm 

## 1.1.1

 * source code ported to TypeScript
 * Types for input files, output files

## 1.2.0 (not published yet)

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
