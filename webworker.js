// This file helps make the compiled js file be imported as a web worker by the src/magickApi.ts file

const stdout = []
const stderr = []
let exitCode = 0


function ChangeUrl(url, fileName)
{
    let splitUrl = url.split('/')
    splitUrl[splitUrl.length -1] = fileName
    return splitUrl.join('/')
}
// const magickJsCurrentPath = 'https://knicknic.github.io/wasm-imagemagick/magick.js';
function GetCurrentUrlDifferentFilename(fileName)
{
    return ChangeUrl(magickJsCurrentPath, fileName)
}

if (typeof Module == 'undefined') {
  Module = {
    noInitialRun: true,
    moduleLoaded: false,
    messagesToProcess: [],

    print: text => { 
      stdout.push(text) 
      console.log(text)      
    },
    printErr: text => { 
      stderr.push(text)
      console.error(text);      
    },
    quit: status=> {
      exitCode = status
    }
  }
  if(typeof magickJsCurrentPath !== "undefined"){
      Module.locateFile = GetCurrentUrlDifferentFilename;
  }

  // see https://kripken.github.io/emscripten-site/docs/api_reference/module.html
  Module.onRuntimeInitialized = function () {
    FS.mkdir('/pictures')
    FS.currentPath = '/pictures'

    Module.moduleLoaded = true
    processFiles()
  }
}

processFiles = function () {
  if (!Module.moduleLoaded) {
    return
  }

  // clean up stdout, stderr and exitCode
  stdout.splice(0, stdout.length)
  stderr.splice(0, stderr.length)
  exitCode = undefined

  for (let message of Module.messagesToProcess) {

    for (let file of message.files) {
      let fileData = file.content
      if(fileData instanceof ArrayBuffer)
      {
        // fileData = new DataView(fileData)
        fileData = new Uint8Array(fileData);
      }
      FS.writeFile(file.name, fileData)
    }

    try {
      Module.callMain(message.args)
    }
    catch (e) { }
    for (let file of message.files) {
      // cleanup source files
      // mogrify then output files have same name, so skip
      if (message.args[0] != 'mogrify') {
        FS.unlink(file.name)
      }
    }

    let dir = FS.open('/pictures')
    let files = dir.node.contents
    let responseFiles = []
    let transfer = []
    for (let destFilename in files) {
      let processed = {}
      processed.name = destFilename
      let read = FS.readFile(destFilename)
      // cleanup read file
      FS.unlink(destFilename)
      
      if('transferable' in message)
      {
        processed.buffer = read
        transfer.push(read.buffer)
      }
      else{
        processed.blob = new Blob([read])
      }
      responseFiles.push(processed)
    }
    message.outputFiles = responseFiles
    message.stdout = stdout.map(s => s)
    message.stderr = stderr.map(s => s)
    message.exitCode = exitCode

    for (let file of message.files) {
      if(file.content instanceof ArrayBuffer)
      {
        transfer.push(file.content)
      }
      else{
        transfer.push(file.content.buffer)
      }
    }
    postMessage(message, transfer)
  }
  Module.messagesToProcess = []
}

onmessage = function (magickRequest) {
  Module.messagesToProcess.push(magickRequest.data)
  processFiles()
}

