export interface MagickFile {
  name: string
}

export interface MagickOutputFile extends MagickFile {
  blob: Blob
}

export interface MagickInputFile extends MagickFile {
  /**
   * Content of the input file.
   */
  content: Uint8Array
}

export function Call(inputFiles: MagickInputFile[], command: string[]): Promise<MagickOutputFile[]> {
  const request = {
    files: inputFiles,
    args: command,
    requestNumber: magickWorkerPromisesKey
  }

  const emptyPromise = CreatePromiseEvent()
  magickWorkerPromises[magickWorkerPromisesKey] = emptyPromise

  magickWorker.postMessage(request)

  magickWorkerPromisesKey = magickWorkerPromisesKey + 1
  return emptyPromise as Promise<MagickOutputFile[]>
}

function CreatePromiseEvent() {
  let resolver
  let rejecter
  const emptyPromise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })
  emptyPromise['resolve'] = resolver
  emptyPromise['reject'] = rejecter
  return emptyPromise
}

const magickWorker = new Worker('magick.js')

const magickWorkerPromises = {}
let magickWorkerPromisesKey = 1

// handle responses as they stream in after being processed by image magick
magickWorker.onmessage = e => {
  // display split images
  const response = e.data
  const getPromise = magickWorkerPromises[response.requestNumber]
  delete magickWorkerPromises[response.requestNumber]
  const files = response.processed
  if (files.length === 0) {
    getPromise.reject('No files generated')
  }
  else {
    getPromise.resolve(files)
  }
}
