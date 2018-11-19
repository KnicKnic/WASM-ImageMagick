<!-- readme for apidocs -->

# wasm-imagemagick reference API

<!-- this readme is being used in the api docs as its headed document -->

## Getting started

Let's consider the following [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) call:

```ts
const { outputFiles, exitCode, stderr} = await execute({
  inputFiles: [await buildInputFile('fn.png', 'image1.png')],
  commands: `
    convert image1.png -bordercolor #ffee44 -background #eeff55 +polaroid image2.png
    convert image2.png -fill #997711 -tint 55 image3.jpg
`
})
if (exitCode) {
  alert(`There was an error with the command: ${stderr.join('\n')}`)
}
else {
  await loadImageElement(outputFiles[1], document.querySelector('#outputImage'))
}
```

 * See [execute](https://github.com/KnicKnic/WASM-ImageMagick/tree/master/apidocs#execute) and {@link executeAndReturnOutputFile} for information on how to execute commands. Also {@link ExecuteResult} and {@link ExecuteConfig}. 

 * See {@link ExecuteCommand} for information about command syntaxes supported. Some utilities related to commands are {@link asCommand}, {@link cliToArray}, {@link arrayToCli}

 * See {@link MagickInputFile}, {@link MagickOutputFile} for information about image magick files. 
 
   * Some utilities related to files are {@link buildInputFile}, {@link asInputFile}, {@link asOutputFile}, {@link loadImageElement}, {@link  getInputFilesFromHtmlInputElement}

 * See {@link call} for the low level command execution API

 * Some utilities related to images are: {@link compare}, {@link extractInfo}, {@link getBuiltInImages}

 * Some utilities related to image and execution management are {@link ImageHome}, {@link ExecutionContext}

 