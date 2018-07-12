
if (typeof Module == "undefined") {
    Module = {
      'noInitialRun' : true
    };
 // see https://kripken.github.io/emscripten-site/docs/api_reference/module.html
}

// import "./magick";

var moduleLoaded = false;
var messagesToProcess = [];
Module.onRuntimeInitialized = function (){
  //console.log('loaded wasm')
  FS.mkdir('/pictures');
  FS.currentPath = '/pictures'

  moduleLoaded = true;
  //alert('loaded')
  processFiles();
};

processFiles = function(){
    if(!moduleLoaded)
    {
        return;
    }
    
    for( let message of messagesToProcess)
    {
        for( let file of message['files'])
        {
            FS.writeFile(file['name'], file['content']);
        }

        try{
            Module['callMain'](message['args']);
        }
        catch(e){};
        for( let file of message['files'])
        {
            // cleanup source files
            FS.unlink(file['name'])
        }
                
        let dir = FS.open('/pictures')
        let files = dir.node.contents;
        let responseFiles = [];
        for(let destFilename in files){
            let processed = {};
            processed['name'] = destFilename;
            let read = FS.readFile(destFilename);
            // cleanup read file
            FS.unlink(destFilename)

            processed['blob'] =  new Blob([read]);
            responseFiles.push(processed);
        }
        message['processed'] = responseFiles
        postMessage(message);
    }
    messagesToProcess = [];
};

onmessage = function(magickRequest) {
    messagesToProcess.push(magickRequest.data);
    //console.log('Message received from main script ' + picture);
    processFiles();
  }