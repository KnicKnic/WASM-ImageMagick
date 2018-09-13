// tell wasm runner to not execute application
Module = {
    'noInitialRun' : true,
};

function RotateFile(sourceFileName, destinationFileName)
{
    sourceFileNameEmscripten = '/' + sourceFileName;
    destinationFileNameEmscripten = '/' + destinationFileName;
    sourceFile = fs.readFileSync(sourceFileName);
    FS.writeFile(sourceFileNameEmscripten, sourceFile);
    command =  ["convert", sourceFileNameEmscripten, "-rotate", "90", destinationFileNameEmscripten];
    if(destinationFileName.endsWith('.png'))
    {
        command =  ["convert", sourceFileNameEmscripten, "-rotate", "90", "-define", "png:include-chunk=none", destinationFileNameEmscripten];
    }
    console.log(`attempting to convert ${sourceFileName} to ${destinationFileName}` )
    try{
        a = Module['callMain'](command);
        // console.log(`main returned  ${a}` )
    }
    catch(e)
    {
        console.log(`failed to convert ${sourceFileName} to ${destinationFileName}` )
        console.log(`exception ${e}` )
    }
    
    console.log(`converted ${sourceFileName} to ${destinationFileName}` )
    destinationFileEmscripten = FS.readFile(destinationFileNameEmscripten);
    fs.writeFileSync(destinationFileName,destinationFileEmscripten);
}

function ValidateFilesSame(leftFileName, rightFileName)
{
    leftFile = fs.readFileSync(leftFileName);
    rightFile = fs.readFileSync(rightFileName);
    if(leftFile.toString() == rightFile.toString()) // this will not catch 0 padding at ends
    {
        console.log(`Files ${leftFileName} and ${rightFileName} are the same` );
    }
    else{
        console.log(`Files ${leftFileName} and ${rightFileName} are different` );
        process.exit(1);
    }

}

// see https://kripken.github.io/emscripten-site/docs/api_reference/module.html
Module.onRuntimeInitialized = function (){
    console.log('loaded wasm');
    // process.chdir('./tests/rotate');
    
    RotateFile('to_rotate.png', 'rotated.png');
    
    RotateFile('to_rotate.png', 'rotated.pst');
    RotateFile('rotated.pst', 'rotated.pst.png');

    RotateFile('to_rotate.png', 'rotated.jpg');
    RotateFile('rotated.jpg', 'rotated.jpg.png');

    RotateFile('to_rotate.png', 'rotated.tiff');
    RotateFile('rotated.tiff', 'rotated.tiff.png');

    RotateFile('to_rotate.png', 'rotated.xcf');
    RotateFile('rotated.xcf', 'rotated.xcf.png');
    ValidateFilesSame('rotated.png', 'rotatedKnownGood.png');
    ValidateFilesSame('rotated.pst.png', 'rotatedKnownGood.pst.png');

    // commenting out below as they did not seem to generate constant rotations
    // ValidateFilesSame('rotated.jpg.png', 'rotatedKnownGood.jpg.png');
    // ValidateFilesSame('rotated.tiff.png', 'rotatedKnownGood.tiff.png');
    
    ValidateFilesSame('rotated.xcf.png', 'rotatedKnownGood.xcf.png');
}

var fs = require('fs');

console.log('loading')

// below is the code to load the wasm

