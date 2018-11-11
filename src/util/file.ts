import { MagickOutputFile, MagickInputFile } from '../magickApi'

export function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
  return new Promise(resolve=>{
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
       resolve((event.target as any).result);
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

export async function buildInputFile(url: string, name: string=url): Promise<MagickInputFile>{
  let fetchedSourceImage = await fetch(url);
  let arrayBuffer = await fetchedSourceImage.arrayBuffer();
  let content = new Uint8Array(arrayBuffer);
  return { name, content }
}

export function uint8ArrayToBlob(arr: Uint8Array): Blob {
  return new Blob([arr])
}

export async function outputFileToInputFile(outputFile: MagickOutputFile): Promise<MagickInputFile> {
  return {
    name: outputFile.name,
    content: await blobToUint8Array(outputFile.blob)
  }
}

export function inputFileToOutputFile(file: MagickInputFile): MagickOutputFile {
  return {
    name: file.name,
    blob: uint8ArrayToBlob(file.content),
  }
}
