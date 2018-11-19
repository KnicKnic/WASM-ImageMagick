import { ExecuteCommand, asCommand, Command, MagickInputFile, extractInfo } from 'wasm-imagemagick'
import { sampleCommandTemplates } from 'imagemagick-browser'

export interface Example {
  name: string
  description: string
  command: ExecuteCommand | ((images: MagickInputFile[]) => Promise<ExecuteCommand>)
}

export const commandExamples: Example[] = [


  {
    name: 'identify simple',
    description: `runs identify program to print to stdout image info`,
    command: `identify rose:`.trim(),
  },


{
  name: '-print all image info',
  description: `prints all properties artifacts and options of the image using -print and formatting the output`,
  command: `
convert $$IMAGE_0 \\
  -print '\\n__Properties__\\n\\n%[*]\\nsesba\\n\\nsa\\n' \\
  -print '\\n__Artifacts__\\n\\n%[artifact:*]' \\
  -print '\\n__Options__\\n\\n%[option:*]\\n' \\
info:
`.trim(),
},

  

  {
    name: 'extract pixel color',
    description: `extract pixel color at 0,0 and save it to info.txt file`,
    command: `convert logo: -format '%[pixel:p{0,0}]' info:info.txt  `.trim(),
  },

  {
    name: 'extract image information',
    description: `extract image information in json format and store it in output file roseinfo.json`,
    command: `convert rose: roseInfo.json  `.trim(),
  },
  


  {
    name: 'simple append',
    description: `simple append+ command that joins two images`,
    command: `
convert -size 100x100 xc:red \\
  \( rose: -rotate -90 \) \\
  +append output.png
  `.trim(),
  },


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
  +distort Polar 0 +repage   star_spiral.gif`.trim(),
  },

  {
    name: 'falling stars',
    description: `use "-motion-blur" to create a field of falling stars`,
    command: `
convert -size 100x100 xc: +noise Random -channel R -threshold .4% \\
    -negate -channel RG -separate +channel \\
    \( +clone \) -compose multiply -flatten \\
    -virtual-pixel tile -blur 0x.4 -motion-blur 0x20+45 -normalize \\
    star_fall.gif`.trim(),
  },
  {
    name: 'simple stars',
    description: `A random noise image is used to thin itself out generate a speckle pattern. Then some effects and colors`,
    command: `
convert -size 100x100 xc: +noise Random -channel R -threshold 5% \\
  -negate -channel RG -separate +channel \\
  -compose multiply -composite   speckles.gif

convert -size 100x100 xc: +noise Random -channel R -threshold 1% \\
  -negate -channel RG -separate +channel \\
  \( +clone \) -compose multiply -flatten \\
  -virtual-pixel tile -blur 0x.4 -contrast-stretch .8% \\
  stars.gif

convert -size 100x100 xc: +noise Random -channel R -threshold 1% \\
  -negate -channel RG -separate +channel \\
  \( xc: +noise Random \) -compose multiply -flatten \\
  -virtual-pixel tile -blur 0x.4 -contrast-stretch .8% \\
  stars_colored.gif
`.trim(),
  },

  // commented - not working : 
  {
    name: 'star bursts',
    description: `Here we motion blur the stars in six directions (in pairs) then merge them together to create a field of 'star bursts', such as you get in a glass lens.`,
    command: `
convert -size 100x100 xc: +noise Random -channel R -threshold .2% \\
  -negate -channel RG -separate +channel \\
  \( +clone \) -compose multiply -flatten \\
  -virtual-pixel tile  -blur 0x.3 \\
  \( -clone 0  -motion-blur 0x10+15  -motion-blur 0x10+195 \) \\
  \( -clone 0  -motion-blur 0x10+75  -motion-blur 0x10+255 \) \\
  \( -clone 0  -motion-blur 0x10-45  -motion-blur 0x10+135 \) \\
  -compose screen -background black -flatten  -normalize \\
    -compose multiply -layers composite \\
    -set delay 30 -loop 0 -layers Optimize    \\
  star_field.gif`.trim(),
  },

  {
    name: 'stars animation',
    description: `By combining the above with a plasma glitter animation you can make set of stars that look like christmas decorations.`,
    command: `
convert -size 100x100 xc: +noise Random -separate \\
  null: \\
    \( xc: +noise Random -separate -threshold 50% -negate \) \\
    -compose CopyOpacity -layers composite \\
  null: \\
    plasma:red-firebrick plasma:red-firebrick plasma:red-firebrick \\
    -compose Screen -layers composite \\
  null:  \\
    \( xc: +noise Random -channel R -threshold .08% \\
      -negate -channel RG -separate +channel \\
      \( +clone \) -compose multiply -flatten \\
      -virtual-pixel tile  -blur 0x.4 \\
      \( -clone 0  -motion-blur 0x15+90  -motion-blur 0x15-90 \) \\
      \( -clone 0  -motion-blur 0x15+30  -motion-blur 0x15-150 \) \\
      \( -clone 0  -motion-blur 0x15-30  -motion-blur 0x15+150 \) \\
      -compose screen -background black -flatten  -normalize \) \\
    -compose multiply -layers composite \\
  -set delay 30 -loop 0 -layers Optimize       stars_xmas.gif

`.trim(),
  },

  {
    name: 'radial flare',
    description: `the width of the initial image before polar distorting, basically sets the number of rays that will be produced`,
    command: `
    convert -size 100x1 xc: +noise Random -channel G -separate +channel \\
    -scale 100x100!                                +write flare_1a.png \\
    \( -size 100x100 gradient:gray(100%) -sigmoidal-contrast 10x50% \) \\
    -colorspace sRGB -compose hardlight -composite  +write flare_1b.png \\
    -virtual-pixel HorizontalTileEdge -distort Polar -1 \\
    flare_1_final.png
`.trim(),
  },


  {
    name: 'radial flare2',
    description: `another example using multiple overlays to achieve a different looking flare. Note the technique used to generating intermediate debugging and example images showing the steps involved.`,
    command: `
convert -size 100x1 xc: +noise Random -channel G -separate +channel \\
    -size 100x99 xc:black -append -motion-blur 0x35-90 \\
    \( -size 100x50 gradient:gray(0) \\
       -evaluate cos .5 -sigmoidal-contrast 3,100% \\
       -size 100x50 xc:gray(0) -append \) \\
    \( -size 1x50 xc:gray(0) \\
       -size 1x1 xc:gray(50%) \\
       -size 1x49 xc:gray(0) \\
       -append -blur 0x2 -scale 100x100! \) \\
    -scene 10 +write flare_2%x.png \\
    -background gray(0) -compose screen -flatten +write flare_2f.png \\
    -virtual-pixel HorizontalTileEdge -distort Polar -1 \\
    -colorspace sRGB flare_2_final.png
`.trim(),
  },





]

let selectExampleCounter = 0

sampleCommandTemplates.forEach(template => {

  const example: Example = {
    name: template.name,
    description: template.description,
    async command(inputFiles: MagickInputFile[]) {
      const img = inputFiles[0]
      const info = await extractInfo(img)
      const context = { ...template.defaultTemplateContext, imageWidth: info[0].image.geometry.width, imageHeight: info[0].image.geometry.height }
      const command = template.template(context)[0].map(s => s === '$INPUT' ? img.name : s === '$OUTPUT' ? `output${selectExampleCounter++}.png` : s)
      return command
    },
  }
  commandExamples.push(example)

})
