// This file helps make the compiled js file be imported as a web worker by the src/magickApi.ts file

const stdout = []
const stderr = []
let exitCode = 0

if (typeof Module == 'undefined') {
  Module = {
    noInitialRun: true,
    moduleLoaded: false,
    messagesToProcess: [],
    onRuntimeInitialized: function () {
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
      FS.writeFile(file.name, file.content)
    }

    try {
      Module.callMain(message.args)
    }
    catch (error) {
      console.error('Error in Module.callMain worker thread: ', error, error && error.stack)
    }
    // cleanup source files
    for (let file of message.files) {
      if (message.args[0] != 'mogrify') {
        // heads up: mogrify command override input files so we skip file unlink
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
      // cleanup read file
      FS.unlink(destFilename)
      processed.blob = new Blob([read])
      responseFiles.push(processed)
    }
    message.outputFiles = responseFiles
    message.stdout = stdout.map(s => s)
    message.stderr = stderr.map(s => s)
    message.exitCode = exitCode
    postMessage(message)
  }
  Module.messagesToProcess = []
}

onmessage = function (magickRequest) {
  Module.messagesToProcess.push(magickRequest.data)
  processFiles()
}

