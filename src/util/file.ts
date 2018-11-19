import { MagickFile, MagickInputFile, MagickOutputFile } from '..'
import { execute } from '../execute'

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

export function isInputFile(file: any): file is MagickInputFile {
  return !!(file as MagickInputFile).content
}
export function isOutputFile(file: any): file is MagickOutputFile {
  return !!(file as MagickOutputFile).blob
}

function uint8ArrayToString(arr: Uint8Array, charset: string = 'utf-8'): string {
  return new TextDecoder(charset).decode(arr)
}

/**
 * Read files as string. Useful when files contains plain text like in the output file info.txt of `convert logo: -format '%[pixel:p{0,0}]' info:info.txt`
 */
export async function readFileAsText(file: MagickFile): Promise<string> {
  if (isInputFile(file)) {
    return uint8ArrayToString(file.content)
  }
  if (isOutputFile(file)) {
    return await blobToString(file.blob)
  }
}

export async function isImage(file: MagickFile): Promise<boolean> {
  if (getFileNameExtension(file) === 'svg') {
    return true
  }
  const { exitCode } = await execute({ inputFiles: [await asInputFile(file)], commands: `identify ${file.name}` })
  return exitCode === 0
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
  if (isOutputFile(f)) {
    inputFile = await outputFileToInputFile(f)
  }
  else {
    inputFile = f as MagickInputFile
  }
  inputFile.name = name
  return inputFile
}

export async function asOutputFile(f: MagickFile, name: string = f.name): Promise<MagickOutputFile> {
  let outputFile: MagickOutputFile
  if (isInputFile(f)) {
    outputFile = inputFileToOutputFile(f)
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
export function getFileNameExtension(filePathOrUrlOrFile: string | MagickFile) {
  const s = getFileName(typeof filePathOrUrlOrFile === 'string' ? filePathOrUrlOrFile : filePathOrUrlOrFile.name)
  return s.substring(s.lastIndexOf('.') + 1, s.length)
}
