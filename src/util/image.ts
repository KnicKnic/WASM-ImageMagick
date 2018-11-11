import { asInputFile, Call, MagickFile, blobToString } from "..";

export async function compare(img1: MagickFile, img2: MagickFile, error: number = 0.01): Promise<boolean> {
  const result = await Call(
    [await asInputFile(img1), await asInputFile(img2)], 
    ['convert', img1.name, img2.name, 
     '-resize', '256x256^!', 
     '-metric', 'RMSE',
      '-format', '%[distortion]', 
      '-compare', 'info:info.txt']
    )
  const n = await blobToString(result[0].blob)
  const identical = parseFloat(n)
  return identical <= error
}

export async function extractInfo(img: MagickFile): Promise<any>{
  let inputImage =  await asInputFile(img)
  let processedFiles = await Call( [inputImage], ["convert", inputImage.name, "info.json"]);
  return  JSON.parse(await blobToString(processedFiles[0].blob))
}
