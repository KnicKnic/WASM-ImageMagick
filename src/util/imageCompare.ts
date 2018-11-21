import { asInputFile, Call, MagickFile, blobToString, MagickInputFile } from '..'

/**
 * Compare the two images and return true if they are equal visually. Optionally, a margin of error can be provided using `fuzz`
 */
export async function compare(img1: MagickFile | MagickFile[] | string, img2?: MagickFile | string, fuzz: number = 0.015): Promise<boolean> {
  if(Array.isArray(img1)){
    img2 = img1[1]
    img1 = img1[0]
  }
  const identical = await compareNumber(img1, img2)
  return identical <= fuzz
}

export async function compareNumber(img1: MagickFile | string, img2: MagickFile | string): Promise<number> {
  const imgs: MagickInputFile[] = []
  let name1: string
  let name2: string
  if (typeof img1 !== 'string') {
    const inputFile = await asInputFile(img1)
    imgs.push(inputFile)
    name1 = inputFile.name
  }
  else {
    name1 = img1
  }
  if (typeof img2 !== 'string') {
    const inputFile = await asInputFile(img2)
    imgs.push(inputFile)
    name2 = inputFile.name
  }
  else {
    name2 = img2
  }
  const result = await Call(imgs,
    ['convert', name1, name2, '-resize', '256x256^!', '-metric', 'RMSE', '-format', '%[distortion]', '-compare', 'info:info.txt'],
  )
  const n = await blobToString(result[0].blob)
  return parseFloat(n)
}
