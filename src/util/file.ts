import { MagickInputFile, MagickOutputFile, MagickFile } from '..'

function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onload = event => {
      const result = (event.target as any).result as ArrayBuffer
      resolve(new Uint8Array(result))
    }
    fileReader.readAsArrayBuffer(blob)
  })
}

export function blobToString(blb: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('loadend', e => {
      const text = (e.srcElement as any).result as string
      resolve(text)
    })
    reader.readAsText(blb)
  })
}

/**
 * Builds a new {@link MagickInputFile} by fetching the content of given url and optionally naming the file using given name 
 * or extracting the file name from the url otherwise.
 */
export async function buildInputFile(url: string, name: string = getFileName(url)): Promise<MagickInputFile> {
  const fetchedSourceImage = await fetch(url)
  const arrayBuffer = await fetchedSourceImage.arrayBuffer()
  const content = new Uint8Array(arrayBuffer)
  return { name, content }
}

function uint8ArrayToBlob(arr: Uint8Array): Blob {
  return new Blob([arr])
}

async function outputFileToInputFile(file: MagickOutputFile, name: string = file.name): Promise<MagickInputFile> {
  return {
    name,
    content: await blobToUint8Array(file.blob),
  }
}

function inputFileToOutputFile(file: MagickInputFile, name: string = file.name): MagickOutputFile {
  return {
    name,
    blob: uint8ArrayToBlob(file.content),
  }
}

export async function asInputFile(f: MagickFile, name: string = f.name): Promise<MagickInputFile> {
  let inputFile: MagickInputFile
  if ((f as MagickOutputFile).blob) {
    inputFile = await outputFileToInputFile(f as MagickOutputFile)
  }
  else {
    inputFile = f as MagickInputFile
  }
  inputFile.name = name
  return inputFile
}

export async function asOutputFile(f: MagickFile, name: string = f.name): Promise<MagickOutputFile> {
  let outputFile: MagickOutputFile
  if ((f as MagickInputFile).content) {
    outputFile = inputFileToOutputFile(f as MagickInputFile)
  }
  else {
    outputFile = f as MagickOutputFile
  }
  outputFile.name = name
  return outputFile
}

export function getFileName(url: string): string {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop())
  } catch (error) {
    const s = `http://foo.com/${url}`
    try {
      return decodeURIComponent(new URL(s).pathname.split('/').pop())
    } catch (error) {
      return url
    }
  }
}
export function getFileNameExtension(filePathOrUrl: string) {
  const s = getFileName(filePathOrUrl)
  return s.substring(s.lastIndexOf('.') + 1, s.length)
}
