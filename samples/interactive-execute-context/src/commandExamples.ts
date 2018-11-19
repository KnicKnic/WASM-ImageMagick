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
    command: `convert logo: -format '%[pixel:p{0,0}]' info:$$UNIQUE_NAME.txt  `.trim(),
  },

  {
    name: 'extract image information',
    description: `extract image information in json format and store it in output file roseinfo.json`,
    command: `convert rose: $$UNIQUE_NAME.json  `.trim(),
  },
  



  {
    name: 'pulsing animation',
    description: `generates a radial-gradient image, which is then cloned and adjusted to create a red to brighter red-orange pulse. This is then duplicated to create a reversed Patrol Cycle before creating a 30 second, looped `,
    command: `
  convert -size 101x101 radial-gradient: \\
    \( -clone 0 -level 00,100% +level-colors ,#F00 \) \\
    \( -clone 0 -level 10,100% +level-colors ,#F12 \) \\
    \( -clone 0 -level 20,100% +level-colors ,#F24 \) \\
    \( -clone 0 -level 30,100% +level-colors ,#F36 \) \\
    \( -clone 0 -level 40,100% +level-colors ,#F46 \) \\
    -delete 0  -duplicate 1,-2-1 -set delay 1x30 -loop 0 $$UNIQUE_NAME.gif
    `.trim(),
  },

  {
    name: 'warping local region',
    description: `https://imagemagick.org/Usage/masking/#region_warping`,
    command: `
    convert -size 600x70 xc:darkred \\
    -fill white -draw 'roundrectangle 5,5  595,65 5,5' \\
    -fill black -draw 'rectangle 5,25 595,31' \\
    -fill red -draw 'rectangle 5,39 595,45' \\
    lines.gif
  convert lines.gif \\
    -region 90x70+10+0    -swirl  400  \\
    -region 90x70+100+0   -swirl  400 \\
    -region 90x70+190+0   -swirl -400 \\
    -region 120x70+280+0  -implode 1.5 \\
    -region 100x70+380+0  -implode -7  \\
    -region 101x70+480+0  -wave 10x50 -crop 0x70+0+10! \\
    +region lines_regions.gif
    `.trim(),
  },


  {
    name: 'remove background color',
    description: `https://imagemagick.org/Usage/masking/#difference`,
    command: `
    convert $$IMAGE_0 \( +clone -fx 'p{0,0}' \) \\
    -compose Difference  -composite  \\
    -modulate 100,0  -alpha off  difference.png
convert difference.png  -threshold 15%  boolean_mask.png
convert $$IMAGE_0  boolean_mask.png \\
    -alpha off -compose CopyOpacity -composite \\
    differenceRemoveBackground.png
    `.trim(),
  },







  {
    name: 'simple append',
    description: `simple append+ command that joins two images`,
    command: `
convert -size 100x100 xc:red \\
  $$ALLIMAGES \\
  \( rose: -rotate -90 \) \\
  +append $$UNIQUE_NAME.png
  `.trim(),
  },

  {
    name: 'write pdf',
    description: `append a couple of images and then all images and output a pdf`,
    command: `
montage \\
  null: \\
  \( rose: -rotate -90 -resize 66% \) \\
  null: \\
  \( logo: -rotate -90 -resize 66% \) \\
  $$ALLIMAGES \\
  -page A4 -tile 2x3 -geometry +10+10 -shadow -frame 8   \\
  $$UNIQUE_NAME.pdf
  `.trim(),
  },
  


  {
    name: 'Hourglass Distortion Map',
    description: `https://imagemagick.org/Usage/mapping/#hourglass`,
    command: `
convert -size 100x100 xc:  -channel G \\
    -fx 'sc=.15; (i/w-.5)/(1+sc*cos(j*pi*2/h)-sc)+.5' \\
    -separate  map_hourglass.png

convert $$IMAGE_0 -alpha set  -virtual-pixel transparent -channel RGBA \\
    map_hourglass.png  -fx 'p{ v.p{i*v.w/w,j*v.h/h}.g*w, j}' \\
    distort_hourglass2.png

  `.trim(),
  },

  
  {
    name: 'Spherical Distortion Map',
    description: `https://imagemagick.org/Usage/mapping/#spherical`,
    command: `
convert -size 100x100 xc:  -channel R \\
    -fx 'yy=(j+.5)/h-.5; (i/w-.5)/(sqrt(1-4*yy^2))+.5' \\
    -separate  +channel     sphere_lut.png
convert -size 100x100 xc:black -fill white \\
    -draw 'circle 49.5,49.5 49.5,0'    sphere_mask.png
convert sphere_mask.png \\
    \( +clone -blur 0x20 -shade 110x21.7 -contrast-stretch 0% \\
       +sigmoidal-contrast 6x50% -fill grey50 -colorize 10%  \) \\
    -composite sphere_overlay.png
convert $$IMAGE_0 -resize 100x100!   sphere_lut.png   -fx 'p{ v*w, j }' \\
    sphere_overlay.png   -compose HardLight  -composite \\
    sphere_mask.png -alpha off -compose CopyOpacity -composite \\
    sphere_lena.png

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
