import { asInputFile, asOutputFile, execute, getFileNameExtension, MagickFile, MagickInputFile } from '..'

// utilities related to HTML (img) elements

/**
 * Will load given html img element src with the inline image content. In case forceBrowserSupport=true
 * @param image the image to be loaded
 * @param el the html image element in which to load the image
 * @param forceBrowserSupport if true and the image extension is not supported by browsers, it will convert the image to png
 * and return that src so it can be shown in browsers
 */
export async function loadImageElement(image: MagickFile, el: HTMLImageElement, forceBrowserSupport: boolean = false) {
  el.src = await buildImageSrc(image, forceBrowserSupport)
}

const browserSupportedImageExtensions = ['gif', 'png', 'jpg', 'webp']

/**
 * Return a string with the inline image content, suitable to be used to assign to an html img src attribute. See oadImageElement.
 * @param forceBrowserSupport if true and the image extension is not supported by browsers, it will convert the image to png
 * and return that src so it can be shown in browsers
 */
export async function buildImageSrc(image: MagickFile, forceBrowserSupport: boolean = false): Promise<string> {
  let img = image
  const extension = getFileNameExtension(image.name)
  if (!extension || forceBrowserSupport && browserSupportedImageExtensions.indexOf(extension) === -1) {
    const { outputFiles } = await execute({ inputFiles: [await asInputFile(image)], commands: `convert ${image.name} output.png` })
    outputFiles[0].name = image.name
    img = outputFiles[0]
  }
  const outputFile = await asOutputFile(img)
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
    return { file, content }
  }))
}

/** will build MagickInputFile[] from given HTMLInputElement of type=file that user may used to select several files */
export async function getInputFilesFromHtmlInputElement(el: HTMLInputElement): Promise<MagickInputFile[]> {
  const files = await inputFileToUint8Array(el)
  return files.map(f => ({ name: f.file.name, content: f.content }))
}
