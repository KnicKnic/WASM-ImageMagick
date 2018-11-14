import { MagickFile, MagickInputFile } from '../magickApi'
import { asOutputFile, buildInputFile } from './file'

// utilities related to HTML (img) elements

export async function loadImageElement(image: MagickFile, el: HTMLImageElement) {
  el.src = await buildImageSrc(image)
}

export async function buildImageSrc(image: MagickFile) {
  const outputFile = await asOutputFile(image)
  return URL.createObjectURL(outputFile.blob)
}

function inputFileFiles(el: HTMLInputElement): File[] {
  const files = []
  for (let i = 0; i < el.files.length; i++) {
    const file = el.files.item(i)
    files.push(file)
  }
  return files
}

async function inputFileToUint8Array(el: HTMLInputElement): Promise<{ file: File, content: Uint8Array }[]> {
  return Promise.all(inputFileFiles(el).map(async file => {
    const content = await new Promise<Uint8Array>(resolve => {
      const reader = new FileReader()
      reader.addEventListener('loadend', e => {
        resolve(new Uint8Array(reader.result as any))
      })
      reader.readAsArrayBuffer(file)
    })
    return { file, content  }
  }))
}

/** will build MagickInputFile[] from given HTMLInputElement of type=file that user may used to select several files */
export async function getInputFilesFromHtmlInputElement(el: HTMLInputElement): Promise<MagickInputFile[]> {
  const files = await inputFileToUint8Array(el)
  return files.map(f => ({name: f.file.name, content: f.content}))
}
