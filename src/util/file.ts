import { MagickInputFile, MagickOutputFile, MagickFile } from '../magickApi';

export function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Promise(resolve => {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      const result = (event.target as any).result as ArrayBuffer
      // return result
      resolve(new Uint8Array(result));
    };
    fileReader.readAsArrayBuffer(blob);
  })
}

export function blobToString(blb: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      const text = (e.srcElement as any).result as string;
      resolve(text)
    });
    reader.readAsText(blb);
  })
}

export async function buildInputFile(url: string, name: string = getFileName(url)): Promise<MagickInputFile> {
  let fetchedSourceImage = await fetch(url);
  let arrayBuffer = await fetchedSourceImage.arrayBuffer();
  let content = new Uint8Array(arrayBuffer);
  return { name, content }
}

export function uint8ArrayToBlob(arr: Uint8Array): Blob {
  return new Blob([arr])
}

export async function outputFileToInputFile(file: MagickOutputFile, name: string = file.name): Promise<MagickInputFile> {
  return {
    name,
    content: await blobToUint8Array(file.blob)
  }
}

export function inputFileToOutputFile(file: MagickInputFile, name: string = file.name): MagickOutputFile {
  return {
    name,
    blob: uint8ArrayToBlob(file.content),
  }
}


export async function asInputFile(f: MagickFile): Promise<MagickInputFile> {
  if((f as MagickOutputFile).blob){
    return await outputFileToInputFile(f as MagickOutputFile)
  }
  return f as MagickInputFile
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
    return url
  }
}
export function getFileNameExtension(filePathOrUrl: string) {
  const s = getFileName(filePathOrUrl)
  return s.substring(s.lastIndexOf('.') + 1, s.length)
}

