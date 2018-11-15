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

export async function Call(inputFiles: MagickInputFile[], command: string[]): Promise<MagickOutputFile[]> {
  const result = await call(inputFiles, command)
  return result.outputFiles
}

export interface CallResult {
  outputFiles: MagickOutputFile[]
  stdout: string[]
  stderr: string[]
  exitCode: number
}

export function call(inputFiles: MagickInputFile[], command: string[]): Promise<CallResult> {
  const request = {
    files: inputFiles,
    args: command,
    requestNumber: magickWorkerPromisesKey,
  }

  const promise = CreatePromiseEvent()
  magickWorkerPromises[magickWorkerPromisesKey] = promise

  magickWorker.postMessage(request)

  magickWorkerPromisesKey++
  return promise as Promise<CallResult>
}

function CreatePromiseEvent() {
  let resolver
  let rejecter
  const emptyPromise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  }) as Promise<{}> & { resolve?: any, reject?: any }
  emptyPromise.resolve = resolver
  emptyPromise.reject = rejecter
  return emptyPromise
}

const magickWorker = new Worker('magick.js')

const magickWorkerPromises = {}
let magickWorkerPromisesKey = 1

// handle responses as they stream in after being outputFiles by image magick
magickWorker.onmessage = e => {
  const response = e.data
  const promise = magickWorkerPromises[response.requestNumber]
  delete magickWorkerPromises[response.requestNumber]
  const result = {
    outputFiles: response.outputFiles,
    stdout: response.stdout,
    stderr: response.stderr,
    exitCode: response.exitCode || 0,
  }
  promise.resolve(result)
}
