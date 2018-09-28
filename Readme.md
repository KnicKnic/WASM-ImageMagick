# Web assembly ImageMagick [![Build Status](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_apis/build/status/KnicKnic.WASM-ImageMagick)](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_build/latest?definitionId=1)
This project is not affiliated with [ImageMagick](https://www.imagemagick.org) , but is merely recompiling the code to be [WebAssembly](https://webassembly.org/). I did this because I want to bring the power of ImageMagick to the browser.

## Simple Sample
see [samples/rotate#code](samples/rotate#code)

A simple webpage that has image in array and loads magickApi.js to rotate file

Demonstration site [https://knicknic.github.io/imagemagick/rotate/](https://knicknic.github.io/imagemagick/rotate/)

## Status

Supports PNG, TIFF, JPEG, + Native ImageMagick such as BMP, GIF, [PhotoShop](https://www.adobe.com/products/photoshop.html), [GIMP](https://www.gimp.org/)

## Demos

 * [https://knicknic.github.io/imagemagick/](https://knicknic.github.io/imagemagick/) a commandline sample of using ImageMagick
    * For code see [samples/cmdline](samples/cmdline)

 * Used in [Croppy](https://knicknic.github.io/croppy/) to split webcomics from one long vertical strip into many panels.
    * For code see https://github.com/KnicKnic/croppy

 * [![Basic playground (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lp7lxz6l59)

 * [![Basic playground for image diff (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/yvn6rkr16z)


## Usage with npm

```sh
npm install --save wasm-imagemagick
```

Use it:

```js
import * as Magick from 'wasm-imagemagick'

// the image element where to load output images
const outputImage = document.getElementById('rotatedImage')

// fetch the input image and get its content bytes
const fetchedSourceImage = await fetch("rotate.png")
const sourceBytes = new Uint8Array(await fetchedSourceImage.arrayBuffer());

// calling ImageMagick with one source image, and command to rotate & resize image
const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
const command = ["convert", "srcFile.png", '-rotate', '90', '-resize', '200%', 'out.png']
const processedFiles = await Magick.Call(inputFiles, command)

// response can be multiple files (example split) here we know we just have one
const firstOutputImage = processedFiles[0]
outputImage.src = URL.createObjectURL(firstOutputImage.blob)
console.log('created image ' + firstOutputImage.name)

```

And **don't forget to copy `magick.wasm` and `magick.js`** files to the folder where index.html is being served:

```sh
cp node_modules/wasm-imagemagick/dist/magick.wasm .
cp node_modules/wasm-imagemagick/dist/magick.js .
```

You can then use browserify, tsc, webpack, rollup, etc to build a bundle.js file from previous example.


## Using it directly

If you are not working in a npm development environment you can still load the library with the following code by placing these three files next to your index.html: `magick.js`, `magick.wasm` and `magickApi.js` : 

```js
<script type="module">
import * as Magick from './magickApi.js'
// ...
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

Produces `magick.js` & `magick.wasm` in the current folder. Along with `magickApi.js` that is all the files needed on the webserver.
