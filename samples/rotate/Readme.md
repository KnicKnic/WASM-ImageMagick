# Rotate
A simple example that shows you how to rotate an image

See https://knicknic.github.io/imagemagick/rotate for demonstration website

## code
In index.html see relevant portions called out below `"..."` means I deleted code
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

## Deploy
copy a release [(magickApi.js, magick.js, magick.wasm) or use an exiting release such as https://knicknic.github.io/wasm-imagemagick/magickApi.js] along with this index.html & rotate.png into a webserver.
