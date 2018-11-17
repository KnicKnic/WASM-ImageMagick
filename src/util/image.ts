import { MagickFile, executeAndReturnOutputFile, asInputFile } from "../";
import { readFileAsText } from "./file";

export async function getPixelColor(img: MagickFile, x: number, y: number): Promise<string>{
  const file = await executeAndReturnOutputFile({inputFiles: [await asInputFile(img)], commands: `convert ${img.name} -format '%[pixel:p{${x},${y}}]' info:info.txt`})
  return await readFileAsText(file)
}