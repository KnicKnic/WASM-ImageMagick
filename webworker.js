// This file helps make the compiled js file be imported as a web worker by the src/magickApi.ts file

const stdout = []
const stderr = []
let exitCode = 0

// function changeUrl(url, fileName) {
//     let splitUrl = url.split('/')
//     splitUrl[splitUrl.length -1] = fileName
//     return splitUrl.join('/')
// }
function getMagickJsUrl(fileName) {
  let splitUrl = magickJsCurrentPath.split('/')
  splitUrl[splitUrl.length -1] = fileName
  return splitUrl.join('/')
    // return changeUrl(magickJsCurrentPath, fileName)
}

if (typeof Module == 'undefined') {
  Module = {
    noInitialRun: true,
    moduleLoaded: false,
    messagesToProcess: [],
    locateFile: typeof magickJsCurrentPath !== "undefined" ? getMagickJsUrl : undefined,
    onRuntimeInitialized: () => {
      FS.mkdir('/pictures')
      FS.currentPath = '/pictures'
      Module.moduleLoaded = true
      processFiles()
    },
    print: text => {
      // console.log('LOG', text);
      stdout.push(text)
    },
    printErr: text => {
      stderr.push(text)
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
    for (let file of message.files) {
      FS.writeFile(file.name, file.content)
    }

    try {
      Module.noExitRuntime = true // if not stdout might not be correctly flushed
      Module.callMain(message.args)
      // flush stdio so stdout gets string that doesn't end with new line
      if(Module._fflush) {
        Module._fflush(0)
      }
    }
    catch (error) {
      console.error('Error in Module.callMain worker thread: ', error, error && error.stack)
    }

    // cleanup input files except if command if mogrify since it's the only one that can override input files
    for (let file of message.files) {
      if (message.args[0] != 'mogrify') {
        // TODO : there could be output files that are not overwriting input files in that case we should remove them 
        FS.unlink(file.name)
      }
    }
    let dir = FS.open('/pictures')
    let files = dir.node.contents
    let responseFiles = []
    for (let destFilename in files) {
      let processed = {}
      processed.name = destFilename
      let read = FS.readFile(destFilename)
      FS.unlink(destFilename) // cleanup output file
      processed.blob = new Blob([read])
      responseFiles.push(processed)
    }
    message.outputFiles = responseFiles
    message.stdout = stdout.map(s => s)
    message.stderr = stderr.map(s => s)
    message.exitCode = exitCode
    postMessage(message)

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

