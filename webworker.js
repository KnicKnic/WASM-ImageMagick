// This file helps make the compiled js file be imported as a web worker by the src/magickApi.ts file

// The following is a workaround that checks if this file is being loaded as a normal script and not as a Web Worker, in that case we do nothing. 
// This is because gulp-jasmine-browser will load any .js assets automatically. 
// TODO: fix this: issue reported: https://github.com/jasmine/gulp-jasmine-browser/issues/68
const notInAWebWorker = typeof window!=='undefined' && typeof window.document!=='undefined'
if(notInAWebWorker){
  throw new Error('magick.js must be loaded as a web worker, i.e. new Worker(pathToMagickJs)')
}

const stdout = []
const stderr = []
let exitCode = 0

function getMagickJsUrl(path, prefix) {
  debugger
  let splitUrl = magickJsCurrentPath.split('/')
  splitUrl[splitUrl.length -1] = fileName
  return splitUrl.join('/')
}

if (typeof Module == 'undefined') {
  Module = {
    noInitialRun: true,
    moduleLoaded: false,
    messagesToProcess: [],
    // locateFile: typeof magickJsCurrentPath !== "undefined" ? getMagickJsUrl : undefined,
    onRuntimeInitialized: () => {
      FS.mkdir('/pictures')
      FS.currentPath = '/pictures'
      Module.moduleLoaded = true
      processFiles()
    },
    print: text => {
      stdout.push(text)
      postMessage({type: 'stdout', text})
    },
    printErr: text => {
      stderr.push(text)
      postMessage({type: 'stderr', text})
      console.error(text);
    },
    quit: status => {
      exitCode = status
    }
  }
}

function processFiles() {
  if (!Module.moduleLoaded) {
    return
  }

  for (let message of Module.messagesToProcess) {
    if(message.type!=='call'){
      // TODO: handle other types of request in the future, for example, 
      // users might request current stdout/err asynchronously for a given requestNumber/id. 
      // Also maybe a query to see if the module is ready (moduleLoaded)
      // Right now we only support command execution requests
      continue; 
    }
    for (let file of message.files) {
      FS.writeFile(file.name, file.content)
    }

    try {
      Module.noExitRuntime = true // if not stdout might not be correctly flushed
      Module.callMain(message.command)
      // flush stdio so clients get stdout string that doesn't end with new lines. TODO: investigate why we need this even if we use 
      if(Module._fflush) {
        Module._fflush(0)
        Module._fflush(1)
        Module._fflush(2)
      }
    }
    catch (error) {
      console.error('Error in Module.callMain worker thread: ', error, error && error.stack)
    }

    // cleanup input files except if command if mogrify since it's the only one that can override input files
    for (let file of message.files) {
      if (message.command[0] != 'mogrify') {
        // TODO : there could be output files that are not overwriting input files in that case we should remove them 
        FS.unlink(file.name)
      }
    }
    let dir = FS.open('/pictures')
    let files = dir.node.contents
    let outputFiles = []
    // read all files generated in /pictures folder and remove them from FS to free memory
    for (let destFilename in files) {
      let processed = {}
      processed.name = destFilename
      let read = FS.readFile(destFilename)
      FS.unlink(destFilename)
      processed.blob = new Blob([read])
      outputFiles.push(processed)
    }
    postMessage({
      ...message, 
      type: 'result', 
      outputFiles, 
      stdout: stdout.map(s => s), 
      stderr: stderr.map(s => s), 
      exitCode
    })

    // cleanup stdout, stderr and exitCode
    stdout.splice(0, stdout.length)
    stderr.splice(0, stderr.length)
    exitCode = undefined
  }
  Module.messagesToProcess = []
}

onmessage = function (magickRequest) {
  Module.messagesToProcess.push(magickRequest.data)
  processFiles()
}

