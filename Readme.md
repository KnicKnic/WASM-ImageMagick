# Web assembly ImageMagick [![Build Status](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_apis/build/status/KnicKnic.WASM-ImageMagick)](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_build/latest?definitionId=1)
This project is not affiliated with [ImageMagick](https://www.imagemagick.org) , but is merely recompiling the code to be [WebAssembly](https://webassembly.org/). I did this because I want to bring the power of ImageMagick to the browser.

## Simple Sample
see [samples/rotate#code](samples/rotate#code)

A simple webpage that has image in array and loads magickApi.js to rotate file

Demonstration site [https://knicknic.github.io/imagemagick/rotate/](https://knicknic.github.io/imagemagick/rotate/)

## Status

### Image formats supported

Supports PNG, TIFF, JPEG, + Native ImageMagick such as BMP, GIF, [PhotoShop](https://www.adobe.com/products/photoshop.html), [GIMP](https://www.gimp.org/)

### Features **not** supported 

 * [Text](https://www.imagemagick.org/Usage/text/)
 * [Fourier Transforms](https://www.imagemagick.org/Usage/fourier/)

## Demos

 * [https://knicknic.github.io/imagemagick/](https://knicknic.github.io/imagemagick/) a commandline sample of using ImageMagick
    * For code see [samples/cmdline](samples/cmdline)

 * Used in [Croppy](https://knicknic.github.io/croppy/) to split webcomics from one long vertical strip into many panels.
    * For code see https://github.com/KnicKnic/croppy.

 * Basic playground (React & TypeScript project): [![Basic playground (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lp7lxz6l59).

 * Image Diff Example (React & TypeScript project): [![Basic playground for image diff (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/yvn6rkr16z).

 * [Playground with several transformation examples and image formats](https://cancerberosgx.github.io/autumn-leaves/#/convertDemo). It also shows the output of transformations made with ImageMaick in the browser to verify wasm-imagemagick output the right thing.  

 * [Picture Frame editor](https://cancerberosgx.github.io/autumn-leaves/#/imageFrame).

## Usage with npm

```sh
npm install --save wasm-imagemagick
```

Use the low-level `Call()` API:

```js
import { Call } from 'wasm-imagemagick'

// fetch the input image and get its content bytes
const fetchedSourceImage = await fetch("rotate.png")
const sourceBytes = new Uint8Array(await fetchedSourceImage.arrayBuffer());

// calling ImageMagick with one source image, and command to rotate & resize image
const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
const command = ["convert", "srcFile.png", '-rotate', '90', '-resize', '200%', 'out.png']
const processedFiles = await Call(inputFiles, command)

// response can be multiple files (example split) here we know we just have one
const firstOutputImage = processedFiles[0]

// create a html image element to show the output image:
const outputImage = document.getElementById('rotatedImage')
outputImage.src = URL.createObjectURL(firstOutputImage.blob)
console.log('created image ' + firstOutputImage.name)
```

And **don't forget to copy `magick.wasm` and `magick.js`** files to the folder where index.html is being served:

```sh
cp node_modules/wasm-imagemagick/dist/magick.wasm .
cp node_modules/wasm-imagemagick/dist/magick.js .
```

You can then use browserify, tsc, webpack, rollup, etc to build a bundle.js file from previous example.

### High level API and utilities

`wasm-imagemagick` comes with some easy to use APIs for creating image files from urls, executing multiple commands reusing output imges and nicer command syntax, and utilities to handle html images, image comparission, metadata extraction,  etc. The following example is equivalent to the previous using these APIs: 

```ts
import { buildInputFile, execute, loadImageElement } from 'wasm-imagemagick'
 
const {outputFiles} = await execute({
  inputFiles: [await buildInputFile('http://some-cdn.com/foo/fn.png', 'image1.png')],
  commands: [
    'convert image1.png -rotate 70 image2.gif',
    // heads up: the next command uses 'image2.gif' which was the output of previous command:
    'convert image2.gif -scale 23% image3.jpg',
  ],
})
await loadImageElement(outputFiles[0], document.getElementById('transformedImage'))
```

## Using it directly from the HTML file

If you are not working in a npm development environment you can still load the library with the following code by placing these three files next to your index.html: `magick.js`, `magick.wasm` and `magickApi.js` : 

```js
<script type="module">
import * as Magick from './magickApi.js'
// ... same snippet as before
</script>
```

### Usage Details

1. import magickApi.js in a javascript module
1. call "Call" in the module
    1. Pass in 2 parameters, 
        1. an array of objects 
            1. name:"filename" 
            1. blob: new Uint8Array(contents)
        1. array of magick cmdline args
    1. example: `Call([{name: "filenamestring", blob: new Uint8Array(imageContents)}], ["mogrify", "-thumbnail", "10%", "*"])`
1. get promise 
    1. on Success an array of objects
        1. name: "filename" 
        1. blob: new Blob(contents)
    1. on error a string

For working sample code see [samples/rotate](samples/rotate)


## Build instructions

```
git clone --recurse-submodules https://github.com/KnicKnic/WASM-ImageMagick.git

cd WASM-ImageMagick

docker build -t wasm-imagemagick-build-tools .

docker run --rm -it --workdir /code -v "$PWD":/code wasm-imagemagick-build-tools bash ./build.sh

#windows cmd
#docker run --rm -it --workdir /code -v %CD%:/code wasm-imagemagick-build-tools bash ./build.sh
```

Produces `magick.js` & `magick.wasm` in the current folder.

Note: `npm run build` will perform all the previous commands plus compiling the TypeScript project.


## Run tests

`npm test` will run some tests with nodejs located at `./tests/rotate`.

`npm run test-browser` will run spec in a headless chrome browser. This tests are located at `./spec/`.