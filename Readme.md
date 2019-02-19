# Web assembly ImageMagick [![Build Status](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_apis/build/status/KnicKnic.WASM-ImageMagick)](https://dev.azure.com/oneeyedelf1/wasm-imagemagick/_build/latest?definitionId=1)
This project is not affiliated with [ImageMagick](https://www.imagemagick.org) , but is merely recompiling the code to be [WebAssembly](https://webassembly.org/). I did this because I want to bring the power of ImageMagick to the browser.

**Table of Contents**

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [Demos and examples](#demos-and-examples)
- [Status](#status)
  - [Image formats supported](#image-formats-supported)
  - [Features **not** supported](#features-not-supported)
- [API](#api)
  - [High level API and utilities](#high-level-api-and-utilities)
  - [Accessing stdout, stderr, exitCode](#accessing-stdout-stderr-exitcode)
  - [low-level example](#low-level-example)
- [Importing the library in your project](#importing-the-library-in-your-project)
  - [With npm](#with-npm)
  - [Loading directly from html file](#loading-directly-from-html-file)
    - [Importing it as JavaScript standard module:](#importing-it-as-javascript-standard-module)
    - [Using the UMD bundle in AMD projects (requirejs)](#using-the-umd-bundle-in-amd-projects-requirejs)
    - [Using the UMD bundle without libraries](#using-the-umd-bundle-without-libraries)
- [Build instructions](#build-instructions)
- [Run tests](#run-tests)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Demos and examples

 * Simplest example. See [samples/rotate#code](samples/rotate#code). A simple webpage (plain javascript) that has image in array and loads magickApi.js to rotate file. Demonstration site [https://knicknic.github.io/imagemagick/rotate/](https://knicknic.github.io/imagemagick/rotate/)

 * Basic playground (React & TypeScript project): [![Basic playground (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/lp7lxz6l59).

 * Image Diff Example (React & TypeScript project): [![Basic playground for image diff (React & TypeScript project)](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/yvn6rkr16z).

 * [Interactive execute context demo](https://cancerberosgx.github.io/demos/WASM-ImageMagick/interactive-execute-context/). Add images, execute commands using different syntaxes, manage and reuse output/input images, and choose commands examples to learn ImageMagick. [Project lives here](./samples/interactive-execute-context)

 * [Playground with several transformation examples and image formats](https://cancerberosgx.github.io/autumn-leaves/#/convertDemo). It also shows the output of transformations made with ImageMagick in the browser to verify wasm-imagemagick output the right thing.  

 * [Picture Frame editor](https://cancerberosgx.github.io/autumn-leaves/#/imageFrame).

 * [https://knicknic.github.io/imagemagick/](https://knicknic.github.io/imagemagick/) a commandline sample of using ImageMagick
    * For code see [samples/cmdline](samples/cmdline)

 * Used in [Croppy](https://knicknic.github.io/croppy/) to split webcomics from one long vertical strip into many panels.
    * For code see https://github.com/KnicKnic/croppy.



## Status

### Image formats supported

Supports PNG, TIFF, JPEG, BMP, GIF, [PhotoShop](https://www.adobe.com/products/photoshop.html), [GIMP](https://www.gimp.org/), and more! 

See a list of known supported formats in this [demo](https://cancerberosgx.github.io/demos/WASM-ImageMagick/supported-formats/)

### Features **not** supported 

 * [Text](https://www.imagemagick.org/Usage/text/)
 * [Fourier Transforms](https://www.imagemagick.org/Usage/fourier/)
 * Formats not listed above, particularly webp.
 


## API

### Reference API Documentation

[Reference API Documentation](./apidocs)


### High level API and utilities

`wasm-imagemagick` comes with some easy to use APIs for creating image files from urls, executing multiple commands reusing output images and nicer command syntax, and utilities to handle files, html images, input elements, image comparison, metadata extraction, etc. Refer to [API Reference Documentation](./apidocs) for details.

```ts
import { buildInputFile, execute, loadImageElement } from 'wasm-imagemagick'

const { outputFiles, exitCode} = await execute({
  inputFiles: [await buildInputFile('http://some-cdn.com/foo/fn.png', 'image1.png')],
  commands: [
    'convert image1.png -rotate 70 image2.gif',
    // heads up: the next command uses 'image2.gif' which was the output of previous command:
    'convert image2.gif -scale 23% image3.jpg',
  ],
})
if(exitCode !== 0)
    await loadImageElement(outputFiles[0], document.getElementById('outputImage'))
```

### Accessing stdout, stderr, exitCode

This other example executes `identify` command to extract information about an image. As you can see, we access `stdout` from the execution result and check for errors using `exitCode` and `stderr`: 

```ts
import { buildInputFile, execute } from 'wasm-imagemagick'

const { stdout, stderr, exitCode } = await execute({
    inputFiles: [await buildInputFile('foo.gif')], 
    commands: `identify foo.gif`
})
if(exitCode === 0) 
    console.log('foo.gif identify output: ' + stdout.join('\n'))
else 
    console.error('foo.gif identify command failed: ' + stderr.join('\n'))
```

### low-level example

As demonstration purposes, the following example doesn't use any helper provided by the library, only the low level `call()` function which only accept one command, in array syntax only:

```js
import { call } from 'wasm-imagemagick'

// build an input file by fetching its content
const fetchedSourceImage = await fetch("assets/rotate.png")
const content = new Uint8Array(await fetchedSourceImage.arrayBuffer());
const image = { name: 'srcFile.png', content }

const command = ["convert", "srcFile.png", '-rotate', '90', '-resize', '200%', 'out.png']
const result = await call([image], command)

// is there any errors ?
if(result.exitCode !== 0)
    return alert('There was an error: ' + result.stderr.join('\n'))

// response can be multiple files (example split) here we know we just have one
const outputImage = result.processedFiles[0]

// render the output image into an existing <img> element
const outputImage = document.getElementById('outputImage')
outputImage.src = URL.createObjectURL(outputImage.blob)
outputImage.alt = outputImage.name
```


## Importing the library in your project

### With npm

```sh
npm install --save wasm-imagemagick
```

**IMPORTANT:  

**Don't forget to copy `magick.wasm` and `magick.js`** files to the folder where your `index.html` is being served:

```sh
cp node_modules/wasm-imagemagick/dist/magick.wasm .
cp node_modules/wasm-imagemagick/dist/magick.js .
```

Then you are ready to import the library in your project like this: 

```ts
import { execute} from 'wasm-imagemagick'
```

or like this if you are not using standard modules:

```ts
const execute = require('wasm-imagemagick').execute
```


### Loading directly from html file

If you are not working in a npm development environment you can still load the library bundle .js file. It supports being imported as JavaScript standard module or as a UMD module. Again, don't forget to copy `magick.js`, `magick.wasm` in the same folder as your html file.:


#### Importing magickApi.js as a JavaScript standard module: 

Basic version, copy `magickApi.js` as well.

See [samples/rotate#code](samples/rotate#code).

Relevant portions called out below `"..."` means code is missing from example
```html
  <script type='module'>
    //import the library to talk to imagemagick
    import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

    // ...

    // Fetch the image to rotate, and call image magick
    let DoMagickCall = async function () {
      // ....

      // calling image magick with one source image, and command to rotate & resize image
      let processedFiles = await Magick.Call([{ 'name': 'srcFile.png', 'content': sourceBytes }], ["convert", "srcFile.png", "-rotate", "90", "-resize", "200%", "out.png"]);

      // ...
    };
    DoMagickCall();
  </script>
``` 

[Working example source code](samples/rotate/index.html).


#### Importing a bundle as a JavaScript standard module: 


```html
<script type="module">
    import { execute, loadImageElement, buildInputFile } from '../../dist/bundles/wasm-imagemagick.esm-es2018.js'
    // ... same snippet as before
</script>
```

[Working example source code](./tests/bundles/esm-test.html)


#### Using the UMD bundle in AMD projects (requirejs)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"></script>
<script src="../../dist/bundles/wasm-imagemagick.umd-es5.js"></script>
<script>
require(['wasm-imagemagick'], function (WasmImagemagick) {
    const { execute, loadImageElement, buildInputFile } = WasmImagemagick
    // ... same snippet as before
```

[Working example source code](./tests/bundles/umd-test-requirejs.html)


#### Using the UMD bundle without libraries

```html
<script src="../../dist/bundles/wasm-imagemagick.umd-es5.js"></script>
<script>
    const { execute, loadImageElement, buildInputFile } = window['wasm-imagemagick']
    // ... same snippet as before
```

[Working example source code](./tests/bundles/umd-test-nolibrary.html)



## Build instructions

```sh
git clone --recurse-submodules https://github.com/KnicKnic/WASM-ImageMagick.git

cd WASM-ImageMagick

#ubuntu instructions
#   install node
sudo snap install --edge node --classic
#   install typescript
sudo npm install typescript -g
#   install docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
#   be sure to add your user to the to the docker group and relogin

# install and run build
npm install


#windows instructions
# currently broken
# If you really want a build, create a PR, 
# a build will get kicked off, click show all checks -> Details -> top right of the details page (in artifcats) 

# docker run --rm -it --workdir /code -v %CD%:/code wasm-imagemagick-build-tools bash ./build.sh
```

Produces `magick.js`, `magickApi.js`, & `magick.wasm` in the current folder.

## Run tests

`npm test` will run all the tests.

`npm run test-browser` will run spec in a headless chrome browser. These tests are located at `./spec/`. 

`npm run test-browser-server` will serve the test so you can debug them with a browser. 

`npm run test-browser-start` will run the server and start watching for file changes, recompile and restart the server for agile development.

`npm test-node` will run some tests with nodejs located at `./tests/rotate`.
