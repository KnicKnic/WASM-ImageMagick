// tell wasm runner to not execute application
var module_output=''
Module = {
    'noInitialRun' : true,
    'print' : function(text) { console.log(`>> stdout >> ${text}`); module_output = text;  },
    'printErr': function(text) { console.log(`>> stderr >> ${text}`); }
};

function getExtension(fileName){
  return fileName.substring(fileName.lastIndexOf(".")+1)
}
var sourceFileNameEmscripten = ''
var sourceFile = ''
function ValidateFormat(fileName, formatToMatch)
{
    var fileNameEmscripten = '/' + fileName;
    var file = fs.readFileSync(fileName);
    FS.writeFile(sourceFileNameEmscripten, sourceFile);
    
    var command =  ["identify", fileNameEmscripten];
    // couldnt get just grabbing type to work
    // command =  ["identify", "-format", '"%[page]"', fileNameEmscripten]; 
    console.log(`running command ${command}`)
    var matched = false
    try{
        module_output = ''
        var a = Module['callMain'](command);
        console.log(`got format ${module_output}`)
        var form = module_output.split(' ')[1]
        console.log(`got format ${form}` )
        if (formatToMatch == form)
        {matched = true}
    }
    catch(e)
    {
        console.log(`failed to identify ${fileName}` )
        console.log(`exception ${e}` )
        process.exit(1);
    }
    if(!matched)
    {
        console.log(`Error matching format ${formatToMatch}`)
        process.exit(1);
    }    
}

function ConvertImage(sourceFileName, destinationFileName, convertArgs = [])
{
    sourceFileNameEmscripten = '/' + sourceFileName;
    var destinationFileNameEmscripten = '/' + destinationFileName;
    sourceFile = fs.readFileSync(sourceFileName);
    FS.writeFile(sourceFileNameEmscripten, sourceFile);
    var command =  ["convert", sourceFileNameEmscripten].concat(convertArgs, [destinationFileNameEmscripten]);
    if(destinationFileName.endsWith('.png'))
    {
        command =  ["convert", sourceFileNameEmscripten].concat(convertArgs,  ["-define", "png:include-chunk=none", destinationFileNameEmscripten]);
    }
    console.log(`attempting to convert ${sourceFileName} to ${destinationFileName}` )
    console.log(`running command ${command}`)

    try{
        var a = Module['callMain'](command);
    }
    catch(e)
    {
        console.log(`failed to convert ${sourceFileName} to ${destinationFileName}` )
        console.log(`exception ${e}` )
        return false;
    }
    console.log(`ran command ${command}`)
    
    console.log(`converted ${sourceFileName} to ${destinationFileName}` )
    var destinationFileEmscripten = FS.readFile(destinationFileNameEmscripten);
    fs.writeFileSync(destinationFileName,destinationFileEmscripten);
    return true;
}

function RotateFile(sourceFileName, destinationFileName)
{
  var convertArgs = ["-rotate", "90"]
    return ConvertImage(sourceFileName, destinationFileName, convertArgs)
}

function ValidateFilesSame(leftFileName, rightFileName)
{
    var leftFile = fs.readFileSync(leftFileName);
    var rightFile = fs.readFileSync(rightFileName);
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
    
    console.log('\ntesting if png processing works');
    RotateFile('to_rotate.png', 'rotated.png');
    ValidateFormat('to_rotate.png', 'PNG');
    ValidateFilesSame('rotated.png', 'rotatedKnownGood.png');

    console.log('\ntesting if jpg is working');
    RotateFile('to_rotate.jpg', 'rotated.jpg');
    ValidateFormat('rotated.jpg', 'JPEG');

    console.log('\ntesting if tiff is working');
    RotateFile('to_rotate.tiff', 'rotated.tiff');
    ValidateFormat('rotated.tiff', 'TIFF');
    

    console.log('\ntesting if photoshop is working');
    RotateFile('to_rotate.psd', 'rotated.psd');
    ValidateFormat('rotated.psd', 'PSD');

    // gimp encoding is not supported
    console.log('\ntesting if gimp is working');
    RotateFile('to_rotate.xcf', 'rotated.xcf.png');
    ValidateFormat('to_rotate.xcf', 'XCF');

    if(!ConvertImage('FriedrichNietzsche.png', 'FriedrichNietzsche-charcoal.png', ["-charcoal", "5"]))
    {
        console.log("Process IMage threw");
        process.exit(1);
    }
}
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
var fs = require('fs');

console.log('loading')

// below is the code to load the wasm

