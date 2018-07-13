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