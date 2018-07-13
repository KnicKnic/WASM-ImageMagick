# Web assembly ImageMagick
This project is not affiliated with [ImageMagick](https://www.imagemagick.org) , but is merely recompiling the code to be [WebAssembly](https://webassembly.org/). I did this because I found it useful to share the power of ImageMagick with people that had problems with cmdline.

## Status
Supports PNG, TIFF, JPEG, + Native ImageMagick such as BMP, [PhotoShop](https://www.adobe.com/products/photoshop.html), [GIMP](https://www.gimp.org/)

* [https://knicknic.github.io/imagemagick/](https://knicknic.github.io/imagemagick/) a commandline sample of using ImageMagick
    * see [samples/cmdline])(samples/cmdline)

* Used in [Croppy](http://croppy.duckdns.org) to split webcomics from one long vertical strip into many panels.

## Simple Sample
*TODO* 

    Write a simple html that has image in array and loads magickApi.js to rotate file

## Build instructions
```
git clone --recurse-submodules https://github.com/KnicKnic/WASM-ImageMagick.git

cd WASM-ImageMagick

docker build -t wasm-imagemagick-build-tools .

docker run --rm -it --workdir /code -v "$PWD":/code wasm-imagemagick-build-tools bash ./build.sh

#windows cmd
#docker run --rm -it --workdir /code -v %CD%:/code wasm-imagemagick-build-tools bash ./build.sh

```

Produces magick.js & magick.wasm in the current folder. Along with magickApi.js that is all the files needed on the webserver.

To use, 
1. import magickApi.js in a javascript module
1. call "Call" in the module
    1. Pass in 2 parameters, 
        1. an array of objects 
            1. name:"filename" 
            1. blob: new Uint8Array(contents)
        1. array of magick cmdline args
    1. example: [{name: "filenamestring", blob: new Uint8Array(imageContents)}], ["mogrify", "-thumbnail", "10%", "*"]
1. get promise 
    1. on Success an array of objects
        1. name: "filename" 
        1. blob: new Blob(contents)
    1. on error a string
