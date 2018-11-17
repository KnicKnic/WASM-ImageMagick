import { asInputFile, Call, MagickFile, blobToString, MagickInputFile } from '..'
import { ExtractInfoResult } from './imageExtractInfoTypes';

/**
 * Execute `convert $IMG info.json` to extract image metadata. Returns the parsed info.json file contents
 * @param img could be a string in case you want to extract information about built in images like `rose:`
 */
export async function extractInfo(img: MagickFile|string): Promise<ExtractInfoResult[]> {

  // TODO: support several input images - we are already returning an array
  
  let name: string
  let imgs: MagickInputFile[]
  if (typeof img !== 'string') {
    imgs = [await asInputFile(img)]
    name = imgs[0].name
  }
  else {
    name = img
    imgs = []
  }
  const processedFiles = await Call(imgs, ['convert', name, 'info.json'])
  try {
    return JSON.parse(await blobToString(processedFiles[0].blob))
  } catch (ex) {
    return [{error: ex}]
  }
}
