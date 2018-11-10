// import { MagickOutputFile, MagickInputFile, Command } from '../index'

// export async function readImageUrlToUintArray(url: string): Promise<Uint8Array> {
//   let fetchedSourceImage = await fetch(url)
//   let arrayBuffer = await fetchedSourceImage.arrayBuffer()
//   let sourceBytes = new Uint8Array(arrayBuffer)
//   return sourceBytes
// }

// export async function readInputImageFromUrl(url: string, imageName?: string): Promise<MagickInputFile> {
//   const content = await readImageUrlToUintArray(url)
//   let name = imageName || getNameFromUrl(url)
//   return { name, content }
// }

// export function getNameFromUrl(url: string): string {
//   try {
//     return new URL(url).pathname.replace(/^\//, '')
//   } catch (error) {
//     return url
//   }
// }

// export function loadImg(file: MagickOutputFile|MagickInputFile, img: HTMLImageElement) {
//   const outputFile:MagickOutputFile  = !(file as any).blob ? inputFileToOutputFile(file): file as MagickOutputFile
//   img.src = URL.createObjectURL(outputFile.blob)
// }

// export async function buildInputFiles(urls: string[]): Promise<MagickInputFile[]> {
//   const result = await Promise.all(urls.map(async url => {
//     const content = await readImageUrlToUintArray(url)
//     return {
//       content,
//       name: url//TODO extract name from url
//     }
//   }))
//   return result
// }

// export async function blobToUint8Array(blob: Blob): Promise<Uint8Array> {
//   return readImageUrlToUintArray(URL.createObjectURL(blob))
// }

// export function blobToString(blb: Blob): Promise<string> {
//   return new Promise(resolve => {
//     const reader = new FileReader();
//     reader.addEventListener('loadend', (e) => {
//       const text = (e.srcElement as any).result as string;
//       resolve(text)
//     });
//     reader.readAsText(blb);
//   })
// }

// export function blobToBinaryString(blb: Blob): Promise<string> {
//   return new Promise(resolve => {
//     const reader = new FileReader();
//     reader.addEventListener('loadend', (e) => {
//       const text = (e.srcElement as any).result as string;
//       resolve(text)
//     });
//     reader.readAsBinaryString(blb);
//   })
// }

// export async function inputFileToUint8Array(el: HTMLInputElement): Promise<{ file: File, content: Uint8Array }[]> {
//   return Promise.all(inputFileFiles(el).map(async file => {
//     const array = await new Promise<Uint8Array>(resolve => {
//       const reader = new FileReader()
//       reader.addEventListener('loadend', (e) => {
//         resolve(new Uint8Array(reader.result as any))
//       });
//       reader.readAsArrayBuffer(file)
//     })
//     return { file, content: array }
//   }))
// }

// export function uint8ArrayToBlob(arr: Uint8Array): Blob {
//   return new Blob([arr])
// }

// export function inputFileFiles(el: HTMLInputElement): File[] {
//   const files = []
//   for (let i = 0; i < el.files.length; i++) {
//     const file = el.files.item(i)
//     files.push(file)
//   }
//   return files
// }

// export async function outputFileToInputFile(outputFile: MagickOutputFile): Promise<MagickInputFile> {
//   return {
//     name: outputFile.name,
//     content: await blobToUint8Array(outputFile.blob)
//   }
// }

// export function inputFileToOutputFile(file: MagickInputFile): MagickOutputFile {
//   return {
//     name: file.name,
//     blob: uint8ArrayToBlob(file.content),
//   }
// }

// export interface ImageSize {
//   width: number,
//   height: number
// }

// export function getImageSize(url: string): Promise<ImageSize> {
//   return new Promise(resolve => {

//     const img = new Image();
//     img.onload = function () {
//       resolve({
//         width: (this as any).width,
//         height: (this as any).height
//       })
//     }
//     img.src = url;
//   })
// }

// export function writeOutputImageToEl(image: MagickOutputFile, el: HTMLImageElement) {
//   el.src = URL.createObjectURL(image['blob'])
// }

// export function writeInputImageToEl(image: MagickInputFile, el: HTMLImageElement) {
//   el.src = URL.createObjectURL(uint8ArrayToBlob(image.content))
// }


// export function getFileNameFromUrl(urlString: string): string {
//   const url = new URL(urlString.startsWith('http') ? urlString : 'http://localhost/' + urlString)
//   const fileName = url.pathname.substring(url.pathname.lastIndexOf('/') + 1, url.pathname.length)
//   return fileName
// }

// export function getOutputImageNameFor(inputImageName: string, extension: string = inputImageName.substring(inputImageName.indexOf('.'), inputImageName.length)): string {
//   extension = extension === '.tiff' ? '.png' : extension
//   return inputImageName.substring(0, inputImageName.indexOf('.')) + 'Output' + extension
// }
