// a indexCommonsJs.js and index.html test asset files to test installation experience using npm install and
// browserify (probably webpack, rollup, typescript, etc. are very similar). 

// In order for this to work user needs to enter the following commands (see test-npm-install.sh)

// mkdir myproject 
// cp ./* myproject # copy these files in the new project
// cd myproject
// 
// npm init -y
// npm install wasm-imagemagick
// 
// cp ../samples/node-sample-project-assets/* ../tests/rotate/FriedrichNietzsche.png .
// 
// npm install --save-dev browserify
// npx browserify indexCommonsJs.js -o bundle.js
// 
// npm install http-server
// npx http-server .

const Magick = require('wasm-imagemagick')

(async function(){
  // the image element where to load output images
  let outputImage = document.getElementById('rotatedImage');

  // fetch the input image and get its content bytes
  let fetchedSourceImage = await fetch("FriedrichNietzsche.png");
  let arrayBuffer = await fetchedSourceImage.arrayBuffer();
  let sourceBytes = new Uint8Array(arrayBuffer);

  // calling ImageMagick with one source image, and command to rotate & resize image
  const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
  const command = ["convert", "srcFile.png", "-rotate", "90", "-resize", "200%", "out.png"]
  let processedFiles = await Magick.Call(inputFiles, command);

  // response can be multiple files (example split) here we know we just have one
  let firstOutputImage = processedFiles[0]
  outputImage.src = URL.createObjectURL(firstOutputImage['blob'])
  console.log("created image " + firstOutputImage['name'])
})();

