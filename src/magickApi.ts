export interface MagickFile {
  name: string
}

export interface MagickOutputFile extends MagickFile {
  blob: Blob
}

export interface MagickInputFile extends MagickFile {
  /** 
   * Content of the input file. 
   * 
   * This is declared as optional so higher level APIs can extend this interface but it must be initialized in order 
   * to execute convert.
   */
  content?: Uint8Array
}

export function Call(inputFiles: MagickInputFile[], command: string[]): Promise<MagickOutputFile[]> {
  let request = {
    files: inputFiles,
    args: command,
    requestNumber: magickWorkerPromisesKey
  }

  let emptyPromise = CreatePromiseEvent()
  magickWorkerPromises[magickWorkerPromisesKey] = emptyPromise

  magickWorker.postMessage(request)

  magickWorkerPromisesKey = magickWorkerPromisesKey + 1
  return emptyPromise as Promise<MagickOutputFile[]>
}

function CreatePromiseEvent() {
  let resolver
  let rejecter
  let emptyPromise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })
  emptyPromise['resolve'] = resolver
  emptyPromise['reject'] = rejecter
  return emptyPromise
}

let magickWorker = new Worker('magick.js')

let magickWorkerPromises = {}
let magickWorkerPromisesKey = 1

// handle responses as they stream in after being processed by image magick
magickWorker.onmessage = function (e) {
  // display split images
  let response = e.data
  let getPromise = magickWorkerPromises[response.requestNumber]
  delete magickWorkerPromises[response.requestNumber]
  let files = response.processed
  if (files.length == 0) {
    getPromise.reject('No files generated')
  }
  else {
    getPromise.resolve(files)
  }
}