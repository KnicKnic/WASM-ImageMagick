import { MagickInputFile, Call } from "../src";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000


export function blobToString(blob: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve((e.srcElement as any).result)
    })
    reader.readAsText(blob)
  })
}

export async function compare(img1: MagickInputFile, img2: MagickInputFile, error: number = 0.001): Promise<boolean> {
  // console.log('Executing command: ',  ['convert', img1.name, img2.name, '-trim', '+repage', /* '-resize', '"256x256^!"', */ '-metric', 'RMSE', '-format', '%[distortion]', '-compare', 'info:info.txt'].join(' '));
  const result = await Call([img1, img2], ['convert', img1.name, img2.name, '-trim', '+repage', /* '-resize', '"256x256^!"', */ '-metric', 'RMSE', '-format', '%[distortion]', '-compare', 'info:info.txt'])
  const n = await blobToString(result[0].blob)
  const identical = parseInt(n, 10)
  return identical <= error
}

export async function buildInputFile(url: string, name: string=url): Promise<MagickInputFile>{
  let fetchedSourceImage = await fetch(url);
  let arrayBuffer = await fetchedSourceImage.arrayBuffer();
  let content = new Uint8Array(arrayBuffer);
  return { name, content }
}