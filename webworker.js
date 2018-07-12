
if (typeof Module == "undefined") {
    Module = {
      'noInitialRun' : true,
      'moduleLoaded' : false,
      'messagesToProcess' : []      
    };
 // see https://kripken.github.io/emscripten-site/docs/api_reference/module.html
    Module.onRuntimeInitialized = function (){
        //console.log('loaded wasm')
        FS.mkdir('/pictures');
        FS.currentPath = '/pictures'
    
        Module.moduleLoaded = true;
        //alert('loaded')
        processFiles();
    };
}

let processFiles = function(){
    if(!Module.moduleLoaded)
    {
        return;
    }
    
    for( let message of Module.messagesToProcess)
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
    Module.messagesToProcess = [];
};

let onmessage = function(magickRequest) {
    Module.messagesToProcess.push(magickRequest.data);
    //console.log('Message received from main script ' + picture);
    processFiles();
  }