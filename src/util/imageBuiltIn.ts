import pMap from 'p-map'
import { asInputFile, execute, extractInfo, MagickInputFile } from '..'

let builtInImages: MagickInputFile[]
export const builtInImageNames = ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']

/**
 * Gets ImageMagick built-in images like `rose:`, `logo:`, etc in the form of {@link MagickInputFile}s
 */
export async function getBuiltInImages(): Promise<MagickInputFile[]> {
  if (!builtInImages) {
    builtInImages = await pMap(builtInImageNames, async name => {
      const info = await extractInfo(name)
      const {outputFiles} = await execute({commands: `convert ${name} ${`output1.${info[0].image.format.toLowerCase()}`}`} )
      outputFiles[0].name = name
      return await asInputFile(outputFiles[0])
    })
  }
  return builtInImages
}

/**
 * shortcut of {@link getBuiltInImages} to get a single image by name
 */
export async function getBuiltInImage(name: string): Promise<MagickInputFile> {
  const images = await getBuiltInImages()
  return images.find(f => f.name === name)
}
