import { MagickFile, executeAndReturnOutputFile, asInputFile } from '../'
import { readFileAsText } from './file'
import { exec } from 'child_process';
import { execute } from '../execute';
import { MagickInputFile } from '../magickApi';

export async function getPixelColor(img: MagickFile, x: number, y: number): Promise<string> {
  const file = await executeAndReturnOutputFile({ inputFiles: [await asInputFile(img)], commands: `convert ${img.name} -format '%[pixel:p{${x},${y}}]\\n' info:info.txt` })
  const content = await readFileAsText(file)
  return content.trim()
}
/* something that can be -draw by IM */
export interface Shape {
  type: ShapeType
}
export enum ShapeType {
  'Rectangle'='Rectangle'
}
export interface Rectangle extends Shape{
  type: ShapeType.Rectangle
  x1: number
  y1: number
  x2: number
  y2: number
}
export function isRectangle(r: any): r is Rectangle {
  return r.type===ShapeType.Rectangle
}
export function shapeTpDrawCommand(s: Shape): string {
  if(isRectangle(s)){
    return `Rectangle  ${s.x1},${s.y1} ${s.x2},${s.y2}`
  }else {
    throw new Error('dont know how to represent command for shape '+s.type)
  }
}

export async function cutRectangle(image: MagickInputFile, r: Rectangle): Promise<{ modifiedSourceImage: MagickFile, cuttedSection: MagickFile }> {

  const result = await execute({
    inputFiles: [image],
    commands: `convert -alpha set -size \`convert -format '%wx%h\\n' '${image.name}' info:\` xc:white -fill black -draw '${shapeTpDrawCommand(r)}' out.miff`
  })
  const mask = await asInputFile(result.outputFiles.find(f => f.name === 'out.miff'))

  const result2 = await execute({ inputFiles: [image, mask], 
    commands: `convert ${image.name} ${mask.name} -alpha off  -compose CopyOpacity -composite modifiedSourceImage.miff` })
  const modifiedSourceImage = result2.outputFiles.find(f => f.name === 'modifiedSourceImage.miff')

  //also we want to copy the removed portion in image 3
  const result3 = await execute({ inputFiles: [image, mask], 
    commands: `convert ${image.name} ( ${mask.name} -negate )  -alpha off  -compose CopyOpacity -composite cuttedSection.miff` })
  const cuttedSection = result3.outputFiles.find(f => f.name === 'cuttedSection.miff')

  return {
    modifiedSourceImage, cuttedSection
  }
}

// export async function paste