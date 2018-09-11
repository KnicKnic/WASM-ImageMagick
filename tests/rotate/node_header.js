// tell wasm runner to not execute application
Module = {
    'noInitialRun' : true,
};
// see https://kripken.github.io/emscripten-site/docs/api_reference/module.html
Module.onRuntimeInitialized = function (){
    console.log('loaded wasm');
    
    unrotated = fs.readFileSync('./tests/rotate/to_rotate.png')
    // write to emscripten fs so wasm can see it
    FS.writeFile('/to_rotate.png', unrotated);

    // call application using cmdline
    console.log("before convert");
    Module['callMain'](["convert", "/to_rotate.png", "-rotate", "90", "-define", "png:include-chunk=none", "/rotated.png"]);
    console.log("after convert");

    // write data to local file system
    rotatedData = FS.readFile('/rotated.png');
    fs.writeFileSync('./tests/rotate/rotated.png',rotatedData);
    
    // validate rotated file 
    rotatedFile = fs.readFileSync('./tests/rotate/rotated.png')
    rotatedKnownGood = fs.readFileSync('./tests/rotate/rotatedKnownGood.png')
    if(rotatedKnownGood.toString() == rotatedFile.toString()) // this will not catch 0 padding at ends
    {
        console.log("files are the same");
        process.exit(0);
    }
    console.log("files are different");
    process.exit(1);
}

var fs = require('fs');

console.log('loading')

// below is the code to load the wasm
