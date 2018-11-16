import { ExecuteCommand, asCommand, Command, MagickInputFile, extractInfo } from "wasm-imagemagick";
import { sampleCommandTemplates } from "imagemagick-browser";

export interface Example {
  name: string
  description: string
  command: ExecuteCommand | ((images: MagickInputFile[]) => Promise<ExecuteCommand>)
}

export const commandExamples: Example[] = [
  {
    name: 'stars spiral and inwards',
    description: `By Polar Distorting the image we can make the comets flying or spiraling into a point!`,
    command: `
convert -size 250x100 xc: +noise Random -channel R -threshold .4% \\
  -negate -channel RG -separate +channel \\
  \( +clone \) -compose multiply -flatten \\
  -virtual-pixel Tile -background Black \\
  -blur 0x.6 -motion-blur 0x15-90 -normalize \\
  +distort Polar 0 +repage  star_inward.gif

convert -size 250x100 xc: +noise Random -channel R -threshold .4% \\
  -negate -channel RG -separate +channel \\
  \( +clone \) -compose multiply -flatten \\
  -virtual-pixel Tile -background Black \\
  -blur 0x.6 -motion-blur 0x15-60 -normalize \\
  +distort Polar 0 +repage   star_spiral.gif`.trim()
  }
]

let selectExampleCounter = 0

sampleCommandTemplates.forEach(template => {

  const example : Example = {
    name: template.name,
    description: template.description,
    command: async function(inputFiles: MagickInputFile[]) {
      const img = inputFiles[0]
      const info = await extractInfo(img)
      const context = { ...template.defaultTemplateContext, imageWidth: info[0].image.geometry.width, imageHeight: info[0].image.geometry.height }
      const command = template.template(context)[0].map(s => s === '$INPUT' ? img.name : s === '$OUTPUT' ? `output${selectExampleCounter++}.png` : s)
      return command
    }
  }
  commandExamples.push(example)

})
