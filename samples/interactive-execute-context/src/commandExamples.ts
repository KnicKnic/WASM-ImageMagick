import { sampleCommandTemplates } from 'imagemagick-browser'
import { ExecuteCommand, extractInfo, MagickInputFile } from 'wasm-imagemagick'

export interface Example {
  name: string
  description: string
  command: ExecuteCommand | ((images: MagickInputFile[]) => Promise<ExecuteCommand>)
  tags?: ExampleTag[]
}
export enum ExampleTag {
  animation,
  info,
  drawing,
  gradient,
  morph,
  color,
  append,
  format,
  distort,
  text,
  virtualCommand,
  template,
  '3d',
  effect,
  artistic
}

export const commandExamples: Example[] = [

  {
    name: 'identify simple',
    description: `runs identify program to print to stdout image info`,
    command: `identify rose:`.trim(),
    tags: [ExampleTag.info],
  },

  {
    name: 'text transformations and decorations 1',
    description: `render text in cool mannercreate cool text indifferent fonts and shapes `,
    command: `# Heads up: we first build the input file of the font
# and then use it explicitly referencing it by file name
buildFile helvetica.ttf

# next command: spiral like text
convert -font helvetica.ttf -pointsize 100 -background lightblue \\
  -fill navy  'label:Sebastian Gurin IM Examples in the browser' \\
  -rotate 12 -virtual-pixel background -distort Arc 270 \\
  -trim -bordercolor lightblue -border 5x5  \`uniqueName\`.jpg

# next command: Vibrato Font
convert -size 380x100 xc:lightblue -font helvetica.ttf -pointsize 72 \\
  -fill navy  -annotate +25+65 Sebastián \\
  -background lightblue -rotate 85  -wave 2x5   -rotate -85 \\
  -gravity center  -crop 380x100+0+-50 +repage \`uniqueName\`.jpg

# next command: blur shadow
convert -size 400x120 xc:lightblue  -font helvetica.ttf  -pointsize 72 \\
  -fill navy   -annotate +45+95 'Sebastián' -motion-blur 0x25+65 \\
  -fill black  -annotate +45+95 'Sebastián' -motion-blur 0x1+65 \\
  \`uniqueName\`.jpg

  # Psychedelic Font: In a similar way by slowly reducing the stroke width size while swapping colors, a psychedelic outline effect can be easily generated.
convert -size 320x100 xc:lightblue -font \`buildFile 'helvetica.ttf'\` -pointsize 72 -fill white \\
-stroke black -strokewidth 25 -annotate +25+65 'Seba' \\
-stroke white -strokewidth 20 -annotate +25+65 'Seba' \\
-stroke black -strokewidth 15 -annotate +25+65 'Seba' \\
-stroke white -strokewidth 10 -annotate +25+65 'Seba' \\
-stroke black -strokewidth  5 -annotate +25+65 'Seba' \\
-stroke none                  -annotate +25+65 'Seba' \\
\`uniqueName\`.png


convert -size 320x40 xc:lightblue  -font \`buildFile 'helvetica.ttf'\` -pointsize 72 \\
-fill RoyalBlue -annotate 0x125+20+0 'Seba' \\
\\( -size 320x45 gradient:black -append \\) \\
-compose Blur -set option:compose:args 20x5+45 -composite \\
\\( -size 320x60 xc:lightblue \\
   -fill Navy    -annotate 0x0+20+59   'Seba' \\) \\
+swap -append \`uniqueName\`.jpg

# dirty print
convert  xc: \\
-font helvetica.ttf -pointsize 72 -annotate +25+65 'dirty print' \\
-spread 1 -blur 0x1 -threshold 50% -blur 0x1 \`uniqueName\`_dirty.jpg

# arabic text
convert  -font \`buildFile 'AGA-Rasheeq-Regular.ttf'\` -pointsize 72 label:'اخبار دبیرخانه شورای عالی اطلاع رسانی' \`uniqueName\`_arabic.jpg
  `,
    tags: [ExampleTag.text, ExampleTag.virtualCommand],
  },


  {
    name: 'text comet and smoked',
    tags: [ExampleTag.text, ExampleTag.color],
    description: `Comet font: one of the specialised blurs operators, "-motion-blur" allows you to create a comet like tail to objects in an image. 
    Smoking Font: combining this with wave and you can make the comet font look like smoke, a smell, or even flames are rising off the font!`,
    command: `<% 
const angle=44 
const intensity=44
const fontSize=55
const imageWidth=500
const imageHeight=200
const font='waltographUI.ttf'
%>

# build the font passing url and giving it the name 'font1.ttf'
buildFile <%= font %> font1.ttf

convert -size <%=imageWidth %>x<%= imageHeight %> xc:lightblue  -font font1.ttf  -pointsize <%= fontSize %> \\
  -fill navy   -annotate +<%= imageWidth/10 %>+<%= imageHeight/1.7 %> 'Comet Font' -motion-blur 0x<%= intensity %>+<%= angle %> \\
  -fill black  -annotate +<%= imageWidth/10 %>+<%= imageHeight/1.7 %> 'Comet Font' -motion-blur 0x1+<%= angle %> \\
  \`uniqueName\`_comet_font.jpg

convert -size <%=imageWidth %>x<%= imageHeight %> xc:lightblue  -font font1.ttf  -pointsize <%= fontSize %> \\
  -fill black  -annotate +<%= imageWidth/10 %>+<%= imageHeight/1.7 %> 'Smoked Font' -motion-blur 0x<%= intensity %>+<%= angle %> \\
  -background lightblue -wave 3x35 \\
  -fill navy   -annotate +<%= imageWidth/10 %>+<%= imageHeight/1.7 %> 'Smoked Font'  \\
  \`uniqueName\`_smoked_font.jpg
  `.trim(),
  },


  {
    name: 'text metallic',
    tags: [ExampleTag.text, ExampleTag.color],
    description: `This effect is essentually a rounding, and Color Lookup Table replacement effect. `,
    command: `

  convert \\
  -size 1x1000 gradient: \\
  -gamma 0.9 \\
  -function Sinusoid 2.25,0,0.5,0.5 \\
  ( gradient:rgb(100%,100%,80%)-black -gamma 1 ) \\
  +swap \\
  -compose Overlay -composite \\
  -rotate 90 \\
  metallic_clut.png

convert \\
  -pointsize 160 -font \`buildFile 'helvetica.ttf'\`  'label: seba' \\
  -gaussian-blur 0x5 \\
  -level 40%,60% \\
  -gaussian-blur 0x3 \\
  -alpha off \\
  metallic_a.png

convert \\
  -size \`identify -format %wx%h\\n metallic_a.png\` \\
  gradient:rgb(100%,100%,100%)-black \\
  ( metallic_a.png -negate ) \\
  -compose CopyOpacity -composite \\
  ( metallic_a.png \\
    ( +clone -negate -level 0%x10% ) \\
    -compose CopyOpacity -composite \\
    -shade 315x45 -auto-gamma -auto-level \\
  ) \\
  -compose Overlay -composite \\
  metallic_clut.png -clut \\
  ( +clone -background rgb(0,0,75%) -shadow 80x2+3+3 -write metallic_shad.png ) \\
  +swap \\
  -compose Over -composite \\
  -trim +repage \\
  \`uniqueName\`_metallic.png

  `.trim(),
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
    tags: [ExampleTag.info],
  },


  {
    name: 'animate barrel random with template',
    description: `https://imagemagick.org/Usage/canvas/#granularity`,
    tags: [ExampleTag.animation, ExampleTag.distort, ExampleTag.template],
    command: `
<%
const img = \`buildFile fn.png\`
const delay = 20
const frames = 2 // probably you want more than 2 but we want the test to run fast
const t = new Date().getTime()
const names = []
const random = (min, max) => Math.random() * (max - min) + min
const f1 = random(0.02,0.2)
const f2 = random(-0.3,-0.1)
const f3 = random(-0.2, 0.1)
const f4 = random(0.2, 0.5)
%>
<%
  for(var i = 1; i<= frames; i++) {
    const a1 = f1 * i
    const a2 = f2 * Math.log(i + 1)
    const a3 = f3 * Math.log(i + 1)
    const a4 = f4 * Math.log(i + 1)
    const name = \`out_\${t}_\${f1}_\${f2}_\${f3}_\${f4}___\${a1}_\${a2}_\${a3}_\${a4}.miff\`
    names.push(name)
    %>
convert <%= img %> -virtual-pixel random -distort Barrel '<%= a1 %>,<%= a2 %>,<%= a3 %>,<%= a4 %>' <%= name %>
    <%
}
%>
convert -morph 6 -delay <%= delay %> <%= img %> \\
  <%= names[0] %> <%= names.join(' ') %> \\
  <%= names.reverse().join(' ') %> \\
  \`uniqueName\`.gif

`.trim(),
  },




  {
    name: 'animate_granularity',
    description: `https://imagemagick.org/Usage/canvas/#granularity`,
    tags: [ExampleTag.animation, ExampleTag.gradient],
    command: `
# Generate initial random image (also  granularity=0 image
convert -size 150x150 xc: +noise random \\
  # Ensure final image is 'tilable' makes results better too..
  -virtual-pixel tile \\
  # to speed things up - lets limit operaqtions to just the 'G' channel.
  -channel G \\
  # generate a sequence of images with varying granularity
  \( -clone 0 -blur 0x0.5 \) \( -clone 0 -blur 0x0.65 \) \( -clone 0 -blur 0x0.845 \) \( -clone 0 -blur 0x1.0985 \) \( -clone 0 -blur 0x1.42805 \) \( -clone 0 -blur 0x1.85647 \) \( -clone 0 -blur 0x2.41341 \) \( -clone 0 -blur 0x3.13743 \) \( -clone 0 -blur 0x4.07866 \) \( -clone 0 -blur 0x5.30226 \) \( -clone 0 -blur 0x6.89294 \) \( -clone 0 -blur 0x8.96082 \) \( -clone 0 -blur 0x11.6491 \) \( -clone 0 -blur 0x15.1438 \) \( -clone 0 -blur 0x19.6869 \) \( -clone 0 -blur 0x25.593 \) \\
  # normalize and separate a grayscale imag
  -normalize -separate +channel \\
  # separate black and white granules in equal divisions of black,gray,white
  -ordered-dither threshold,3 \\
  # Set intermedite frame animation delay and infinite loop cycle
  -set delay 12 \\
  # give a longer pause for the first image
  \( -clone 0 -set delay 50 \) -swap 0 +delete \\
  # give a longer pause for the last image
  \( +clone -set delay 50 \) +swap +delete \\
  # make it a patrol cycle (see Animation Modifications)
  \( -clone -2-1 \) \\
  # final image save
  -loop 0 \`uniqueName\`animated_granularity.gif
`.trim(),
  },

  {
    name: 'extract pixel color',
    tags: [ExampleTag.info, ExampleTag.color],
    description: `extract pixel color at 0,0 and use command substitution to paint a rectangle with that color`,
    command: `
convert -size 100x60 xc:skyblue \\
  -fill \`convert logo: -format '%[pixel:p{0,0}]' info:\` -stroke black \\
  -draw 'rectangle 20,10 80,50' \`uniqueName\`draw_rect2.gif`.trim(),
  },

  {
    name: 'extract image information',
    tags: [ExampleTag.info],
    description: `extract image information in json format and store it in output file roseinfo.json`,
    command: `convert rose: \`uniqueName\`.json  `.trim(),
  },

  {
    name: 'blur variable',
    tags: [ExampleTag.artistic, ExampleTag.distort],
    description: `https://www.imagemagick.org/Usage/mapping/#blur_angle`,
    command: `
buildFile fn.png
convert -size 106x106 radial-gradient: -negate \\
  -gravity center -crop 75x75+0+0 +repage gradient_radial.jpg
convert gradient_radial.jpg gradient_radial.jpg gradient_polar.jpg \\
  -channel RGB -combine blur_map_polar.jpg
convert fn.png blur_map_polar.jpg \\
  -compose blur -define compose:args=10x0+0+360 -composite \\
  blur_polar.jpg
convert fn.png blur_map_polar.jpg \\
  -compose blur -define compose:args=5x0+90+450 -composite \\
  blur_radial.jpg
convert fn.png blur_map_polar.jpg \\
  -compose blur -define compose:args=10x0+0+180 -composite \\
  blur_weird.jpg
    `.trim(),
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
    -delete 0  -duplicate 1,-2-1 -set delay 1x30 -loop 0 \`uniqueName\`_pulsing_anim.gif
    `.trim(),
    tags: [ExampleTag.animation],
  },



  {
    name: 'Morph using cut/paste and random paths',
    description: ``,
    command: `
<%
  // Morph Configuration. Important, 
  const delay = 13 // time between frames
  const morph = 3  // frames interpolated artificially (smoothly)
  const modePasteCuts = true // if false is just cut randomly, if true we also paste the other image segment
  const frameCount = 19
  const W=200 // both images will be resized to W,H. watch out with the memory
  const H=100
  const pathMinPoints = 4 // random paths are created with points in this range
  const pathMaxPoints = 12

  # Some utilities
  const seq = n => new Array(n).fill(0).map((m, i)=>i)
  const random = (min, max) => Math.trunc(Math.random() * (max - min) + min)
  const randomPath = (w=W, h=H) =>  \`path "M \${seq(random(pathMinPoints, pathMaxPoints)).map(i=>\`\${random(0, w)},\${random(0, h)}\`).join(' ')} Z"\`

  const frames = seq(frameCount)
%>

convert rose: -resize <%=W%>x<%=H%>! 1.miff
convert \`buildFile 'fn.png'\` -resize <%=W%>x<%=H%>! 2.miff

<%  frames.forEach(i=>{ %>

  # cut a random shape from each of them
  cut 1.miff '<%=randomPath()%>' 1<%=i%>.miff 1<%=i%>section.miff
  cut 2.miff '<%=randomPath()%>' 2<%=i%>.miff 2<%=i%>section.miff 

  <% if(modePasteCuts) {%>
    # In this mode we paste the cut fragment from one image to the other:

    paste <%=i===0?'2.miff' : \`2\${i-1}pasted.miff\` %>  1<%=i%>section.miff 0x0 2<%=i%>pasted.miff
    paste <%=i===0?'1.miff' : \`1\${i-1}pasted.miff\` %>  2<%=i%>section.miff 0x0 1<%=i%>pasted.miff

  <%  } %>

<%  }) %>


<% 
// we have all the frames needed let's generate the gifs

if(!modePasteCuts) {%>

  convert -delay <%= delay%>  -morph <%=morph%>  1.miff <%= frames.map(i=>\`1\${i}section.miff\`).join(' ')%> \\
    <%= frames.map(i=>\`2\${i}section.miff\`).reverse().join(' ')%>  2.miff 2.miff 2.miff   \\
    <%= frames.map(i=>\`2\${i}section.miff\`).join(' ')%> \\
    <%= frames.map(i=>\`1\${i}section.miff\`).reverse().join(' ')%>  1.miff 1.miff \\
    \`uniqueName\`_normalMode.gif 

<% }else  {%>
  
  convert -delay <%= delay%>  -morph <%=morph%>  1.miff \\
    <%= frames.map(i=>\`1\${i}pasted.miff\`).join(' ')%>  2.miff 2.miff  \\
    <%= frames.map(i=>\`2\${i}pasted.miff\`).join(' ')%>   1.miff  1.miff 1.miff  \\
    \`uniqueName\`_modePasteCuts.gif 

<%  } %>
    `.trim(),
    tags: [ExampleTag.virtualCommand, ExampleTag.morph, ExampleTag.template],
  },



  {
    name: 'color wheels',
    description: `https://imagemagick.org/Usage/color_basics/`,
    tags: [ExampleTag.gradient, ExampleTag.color],
    command: `
convert -size 100x300 gradient: -rotate 90 \\
    -distort Arc '360 -90.1 50' +repage \\
    -gravity center -crop 100x100+0+0 +repage  angular.png
convert -size 100x100 xc:white                     solid.png
convert -size 100x100 radial-gradient: -negate     radial.png

convert angular.png solid.png radial.png \\
    -combine -set colorspace HSL \\
    -colorspace sRGB colorwheel_HSL.png
convert angular.png solid.png radial.png \\
    -combine -set colorspace HSB \\
    -colorspace sRGB colorwheel_HSB.png
convert angular.png solid.png radial.png \\
    -combine -set colorspace HCL \\
    -colorspace sRGB colorwheel_HCL.png
convert angular.png solid.png radial.png \\
    -combine -set colorspace HCLp \\
    -colorspace sRGB colorwheel_HCLp.png

convert -size 100x100 xc:black \\
    -fill white  -draw 'circle 49.5,49.5 40,4' \\
    -fill black  -draw 'circle 49.5,49.5 40,30' \\
    -alpha copy -channel A -morphology dilate diamond anulus.png
convert angular.png -size 100x100 xc:white xc:gray50 \\
    -combine -set colorspace HSL -colorspace RGB \\
    anulus.png -alpha off -compose Multiply -composite \\
    anulus.png -alpha on  -compose DstIn -composite \\
    -colorspace sRGB hues_HSL.png

convert angular.png -size 100x100 xc:white xc:gray50 \\
    -combine -set colorspace HCL -colorspace RGB \\
    anulus.png -alpha off -compose Multiply -composite \\
    anulus.png -alpha on  -compose DstIn -composite \\
    -colorspace sRGB hues_HCL.png

convert radial.png solid.png angular.png \\
    -combine -set colorspace LCHab \\
    -colorspace sRGB colorwheel_LCHab.png
convert radial.png solid.png angular.png \\
    -combine -set colorspace LCHuv \\
    -colorspace sRGB colorwheel_LCHuv.png


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
    +region \`uniqueName\`_warping_regions.gif
    `.trim(),
    tags: [ExampleTag.drawing],
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
    +region \`uniqueName\`_warping_regions.gif
    `.trim(),
    tags: [ExampleTag.drawing],
  },

  {  
    name: 'Fill color - configurable',
    description: `uses -floodbill or -opaque to replace a color - uses templates to be configurable with varibales`,
    command: `
<%
const fuzz=20
const fillMode='opaque'//'floodfill' // opaque
const floodfillPointX = 5
const floodfillPointY = 5
const opaqueColor = 'white'
const fillColor = 'rgba(34,121,0,0.1)'
const floodfillFragment = \` -floodfill +\${floodfillPointX}+\${floodfillPointY} \\\`convert logo: -format '%[pixel:p{\${floodfillPointX},\${floodfillPointY}}]\\n' info:\\\`\`
const opaqueFragment = \`-opaque \${opaqueColor}\`
%>
convert logo: -alpha set -fuzz <%= fuzz%>% -fill <%= fillColor%> \\
  <%= fillMode==='floodfill' ? floodfillFragment : opaqueFragment %> \`uniqueName\`.png
    
    `.trim(),
  },


  {
    name: 'Rendering text files',
    description: `tests IM capabilities to render a big text file into an image`,
    command: `
convert rose: info:foo.txt
convert -font \`buildFile helvetica.ttf\` text:foo.txt \`uniqueName\`.pdf
    `.trim(),
  },

  {
    name: 'Removing a rectangle using a mask',
    description: `http://www.imagemagick.org/Usage/masking/#two_backgrounde`,
    command: `

<%const img = 'fn.png';  t= new Date().getTime()%>

# we will be removing a rectangle from image 1 using a mask in image2
convert <%=img%> -alpha set 1<%=t%>.miff
convert -alpha set -size \`convert -format '%wx%h\\n' 1<%=t%>.miff info:\` xc:white -fill black -draw 'roundRectangle  23,5 98,25 5,5' 2<%=t%>.miff
convert  1<%=t%>.miff 2<%=t%>.miff -alpha off  -compose CopyOpacity -composite 3<%=t%>.miff
  
#also we want to copy the removed portion in image 3
convert  1<%=t%>.miff ( 2<%=t%>.miff -negate )  -alpha off  -compose CopyOpacity -composite 4<%=t%>.miff

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
    \`uniqueName\`_differenceRemoveBackground.png
    `.trim(),
  },

  {
    name: 'simple append',
    description: `simple append+ command that joins two images`,
    command: `
convert -size 100x100 xc:red \\
  $$ALLIMAGES \\
  \( rose: -rotate -90 \) \\
  +append \`uniqueName\`_append1.png
  `.trim(),
    tags: [ExampleTag.append],
  },

  {
    name: 'write pdf',
    description: `append a couple of images and then all images and output a pdf`,
    tags: [ExampleTag.format],
    command: `
montage \\
  null: \\
  \( rose: -rotate -90 -resize 66% \) \\
  null: \\
  \( logo: -rotate -90 -resize 66% \) \\
  $$ALLIMAGES \\
  -page A4 -tile 2x3 -geometry +10+10 -shadow -frame 8   \\
  \`uniqueName\`_pdf.pdf
  `.trim(),
  },

  {
    name: 'montage polaroid',
    tags: [ExampleTag.append],
    description: `https://www.imagemagick.org/Usage/montage/#overlap`,
    command: `
montage -size 400x400 null: $$ALLIMAGES null: \\
  -auto-orient  -thumbnail 200x200 \\
  -bordercolor Lavender -background black +polaroid -resize 30% \\
  -gravity center -background none -extent 80x80 \\
  -background SkyBlue -geometry -10+2  -tile x1  \`uniqueName\`_polaroid_overlap.jpg
  `.trim(),
  },

  {
    name: 'drawing tests 2',
    description: `https://www.imagemagick.org/Usage/scripts/generate_test`,
    tags: [ExampleTag.drawing],
    command: `
convert -size 100x150 gradient: -rotate 90 \\
  -sigmoidal-contrast 7x50% test_gradient.png

# Create a semi-transparent rectangle of the gradient and flop it left-right
convert -size 150x100 xc:black \\
  -draw 'fill grey50  rectangle  8,8  142,92' +matte \\
  test_gradient.png +swap -compose CopyOpacity -composite \\
  -flop test_bgnd.png

# Draw two overlaping circles and fill then with same (non-flopped) gradient.
convert -size 150x100 xc:black \\
  -draw 'fill white circle    40,50  40,12' \\
  -draw 'fill white circle   110,50 110,12' +matte \\
  test_gradient.png +swap -compose CopyOpacity -composite \\
  test_fgnd.png

# Create a rainbow gradient
convert -size 12x100 xc:Lime -colorspace HSB \\
    gradient:gray66 -compose CopyRed -composite \\
    -colorspace sRGB -rotate 90  -compose Over \\
    -bordercolor black -border 0x1 test_hue.png

# Overlay the images and add some extra colors to result.
convert test_bgnd.png  test_fgnd.png  -composite \\
    -draw 'fill red   circle    25,80  25,98' \\
    -draw 'fill green circle    75,80  75,98' \\
    -draw 'fill blue  circle   125,80 125,98' \\
    test_hue.png -geometry +25+80 -composite \\
    test.png

convert test.png \\
    \( -size 150x100 tile:pattern:hexagons \\
       +clone +swap -compose overlay -composite \) \\
    -compose SrcIn -composite  \`uniqueName\`_tint_overlay_pattern.png
         `.trim(),
  },

  {
    name: 'morph resize',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_resize`,
    tags: [ExampleTag.morph, ExampleTag.animation],
    command: `
    convert rose: $$IMAGE_0 -morph 10 \\
    -layers TrimBounds -set dispose previous -coalesce \\
    -background black -alpha remove \\
    -set delay '%[fx:(t>0&&t<n-1)?10:60]' \\
    -duplicate 1,-2-1  -loop 0  \`uniqueName\`_morph_resize.gif

         `.trim(),
  },
  {
    name: 'morph color',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_color`,
    tags: [ExampleTag.morph, ExampleTag.animation],
    command: `
    convert rose: $$IMAGE_0  -morph 5 \\
    -set delay '%[fx:(t>0&&t<n-1)?10:240]' \\
    -duplicate 1,-2-1    \`uniqueName\`_rose_flip_anim.gif

         `.trim(),
  },

  {
    name: 'morph tile',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_color`,
    tags: [ExampleTag.morph, ExampleTag.animation],
    command: `
 convert rose: $$IMAGE_0 \\
    \( -clone 0 -crop 3x0 \) \\
    -set delay 10 -loop 0  wipe.gif

    convert -size 100x60 -delay 100 \\
    gradient:green-yellow gradient:blue-purple \\
    gradient:orange-white gradient:red-black \\
    -write mpr:stack -delete 0--1 \\
    \\
    mpr:stack'[0]' \( mpr:stack'[1]' -set delay 5 -crop 4x0 \) \\
    mpr:stack'[1]' \( mpr:stack'[2]' -set delay 5 -crop 0x4 \) \\
    mpr:stack'[2]' \( mpr:stack'[3]' -set delay 5 -crop 4x0 -reverse \) \\
    mpr:stack'[3]' \( mpr:stack'[0]' -set delay 5 -crop 0x4 -reverse \) \\
    -loop 0 \`uniqueName\`_wipe_all.gif

         `.trim(),
  },
  {
    name: 'glitter_tiles tile',
    description: `https://www.imagemagick.org/Usage/anim_mods/#glitter_tiles`,
    tags: [ExampleTag.morph, ExampleTag.animation],
    command: `
    convert -size 600x600 xc: +noise Random -separate \\
    null: \( xc: +noise Random -separate -threshold 30% -negate \) \\
        -compose CopyOpacity -layers composite \\
    -set dispose background -set delay 20 -loop 0   glitter_overlay.gif

    convert glitter_overlay.gif \\
    -compose Screen -bordercolor blue -border 0x0  glitter_plasma.gif

            convert glitter_plasma.gif -virtual-pixel tile \\
            -set option:distort:viewport 680x680 -distort SRT 0 \\
            glitter_plasma_tiled.gif

            convert logo: -matte -fuzz 33% -transparent blue logo_holed.gif

            convert logo_holed.gif null: glitter_plasma_tiled.gif \\
            -compose DstOver -layers composite \\
            -loop 0 -layers Optimize \`uniqueName\`_logo_glittered.gif

         `.trim(),
  },

  {
    name: 'animated distorts',
    description: `https://www.imagemagick.org/Usage/anim_mods/#distort`,
    tags: [ExampleTag.morph, ExampleTag.animation],
    command: `

    convert $$IMAGE_0  -duplicate 29  -virtual-pixel tile \\
    -distort SRT '0,0 1, 0, %[fx:w*t/n],%[fx:h*t/n]' \\
    -set delay 10 -loop 0     rose_diagonal_roll.gif

  convert $$IMAGE_0  -duplicate 29  -virtual-pixel Gray \\
    -distort SRT '%[fx:360*t/n]' \\
    -set delay '%[fx:t==0?240:10]' -loop 0     \`uniqueName\`_rose_rotate.gif


         `.trim(),
  },

  {
    name: 'gradient_complex_hues',
    description: `https://www.imagemagick.org/Usage/canvas/#gradient_complex_hues`,
    tags: [ExampleTag.drawing, ExampleTag.gradient],
    command: `
  convert -size 100x100 xc: +size xc:red xc:blue xc:lime -colorspace HSB \\
  -fx 'ar=1/max(1,  (i-50)*(i-50)+(j-10)*(j-10)  ); br=1/max(1,  (i-10)*(i-10)+(j-70)*(j-70)  );  cr=1/max(1,  (i-90)*(i-90)+(j-90)*(j-90)  );  ( u[1]*ar + u[2]*br + u[3]*cr )/( ar+br+cr )' \\
  -colorspace sRGB   gradient_shepards_HSB.gif

    convert -size 100x100 xc: +size xc:red xc:blue xc:lime \\
    -colorspace HSB -channel R \\
    -fx 'aa=u[1]*2*pi; ba=u[2]*2*pi; ca=u[3]*2*pi; ar=1/max(1, hypot(i-50,j-10) ); br=1/max(1, hypot(i-10,j-70) ); cr=1/max(1, hypot(i-90,j-90) );nr=ar+br+cr;   mod(atan2( ( sin(aa)*ar + sin(ba)*br + sin(ca)*cr )/nr,  ( cos(aa)*ar + cos(ba)*br + cos(ca)*cr )/nr )/(2*pi)+1, 1)' \\
    -separate -background white -combine +channel \\
    -set colorspace HSB -colorspace sRGB  gradient_circular_mean_hue.gif

    convert -size 100x100 xc: -colorspace RGB \\
    -sparse-color  Inverse '50,10 red  10,70 blue  90,90 lime' \\
     -colorspace sRGB gradient_inverse_RGB.png

  convert gradient_inverse_RGB.png -colorspace HSB \\
    -channel GB -evaluate set 100% +channel \\
    -colorspace sRGB gradient_inverse_RGB_Hue.gif
         `.trim(),
  },

  {
    name: 'gradient baricentric',
    description: `https://www.imagemagick.org/Usage/canvas/#barycentric`,
    tags: [ExampleTag.drawing, ExampleTag.gradient],
    command: `
    convert -size 100x100 xc: -colorspace RGB \\
    -sparse-color  Barycentric '30,10 red   10,80 blue   90,90 lime' \\
    -colorspace sRGB  -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82  circle 90,90 90,92' \\
    sparse_barycentric1.png

    convert -size 100x100 xc: -colorspace RGB \\
    -sparse-color Barycentric '30,10 red   10,80 blue   90,90 lime' \\
    -colorspace sRGB  -fill white -stroke black \\
    \( -size 100x100 xc:black -draw 'polygon 30,10  10,80  90,90' \) \\
    +matte -compose CopyOpacity -composite \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82  circle 90,90 90,92' \\
    sparse_bary_triangle2.png

    convert -size 100x100 xc:none -draw 'polygon 30,10  10,80  90,90' \\
    -colorspace RGB \\
    -sparse-color Barycentric '30,10 red   10,80 blue   90,90 lime' \\
    -colorspace sRGB   sparse_bary_triangle_3.png
         `.trim(),
  },

  {
    name: 'gradient shepards_power',
    description: `https://www.imagemagick.org/Usage/canvas/#shepards_power`,
    tags: [ExampleTag.drawing, ExampleTag.gradient],
    command: `

    convert -size 100x100 xc: -colorspace RGB -define shepards:power=0.5 \\
    -sparse-color Shepards '30,10 red  10,80 blue  70,60 lime  80,20 yellow' \\
    -colorspace sRGB -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82' \\
    -draw 'circle 70,60 70,62  circle 80,20 80,22' \\
    sparse_shepards_pow0.5.png
 convert -size 100x100 xc: -colorspace RGB -define shepards:power=1 \\
    -sparse-color Shepards '30,10 red  10,80 blue  70,60 lime  80,20 yellow' \\
    -colorspace sRGB -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82' \\
    -draw 'circle 70,60 70,62  circle 80,20 80,22' \\
    sparse_shepards_pow1.png
 convert -size 100x100 xc: -colorspace RGB -define shepards:power=2 \\
    -sparse-color Shepards '30,10 red  10,80 blue  70,60 lime  80,20 yellow' \\
    -colorspace sRGB -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82' \\
    -draw 'circle 70,60 70,62  circle 80,20 80,22' \\
    sparse_shepards_pow2.png
 convert -size 100x100 xc: -colorspace RGB -define shepards:power=3 \\
    -sparse-color Shepards '30,10 red  10,80 blue  70,60 lime  80,20 yellow' \\
    -colorspace sRGB -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82' \\
    -draw 'circle 70,60 70,62  circle 80,20 80,22' \\
    sparse_shepards_pow3.png
convert -size 100x100 xc: -colorspace RGB -define shepards:power=8 \\
    -sparse-color Shepards '30,10 red  10,80 blue  70,60 lime  80,20 yellow' \\
    -colorspace sRGB -fill white -stroke black \\
    -draw 'circle 30,10 30,12  circle 10,80 10,82' \\
    -draw 'circle 70,60 70,62  circle 80,20 80,22' \\
    sparse_shepards_pow8.png
         `.trim(),
  },

  {
    name: 'histogram',
    description: ``,
    tags: [ExampleTag.info, ExampleTag.color],
    command: `
    convert $$IMAGE_0 histogram:histogram.gi

         `.trim(),
  },  
  {
    name: 'all IM -preview',
    description: `execute all -preview supported by IM`,
    tags: [ExampleTag.info, ExampleTag.template],
    command: `
buildFile helvetica.ttf helvetica
<% 
const {stdout} = await execute('convert -list preview')
stdout.forEach(preview => {
%>
convert rose: -preview <%= preview %> 'Preview:\`uniqueName\`.png'
<%
})
%>
         `.trim(),
  },

  {
    name: 'text with aqua font',
    description: ``,
    tags: [ExampleTag.text, ExampleTag["3d"]],
    command: `
buildFile Candice.ttf
convert -background none -fill DodgerBlue \\
  -font Candice.ttf -pointsize 172  label:A  -trim +repage \\
  -bordercolor None -border 1x1  \\
  aqua_shape.png

convert aqua_shape.png  \\
  -alpha Extract -blur 0x4 -shade 170x30 -alpha On \\
  -background gray50 -alpha background  -function polynomial  '3.5,-5.05,2.05,0.3' -auto-level -normalize \\
  aqua_shade.png

convert aqua_shade.png aqua_shape.png \\
  -alpha Off -compose CopyOpacity -composite    aqua_shade-mask.png
  
convert aqua_shape.png aqua_shade-mask.png \\
  -compose Hardlight -composite   aqua_result.png
         `.trim(),
  },

  {
    name: 'gradients and histograms',
    description: ``,
    tags: [ExampleTag.gradient, ExampleTag.color],
    command: `
<% const t = new Date().getTime() %>
convert -size 5x300 gradient: -rotate 90 linear<%=t%>.png
convert linear<%=t%>.png histogram:linear_hist<%=t%>.png

convert linear<%=t%>.png -evaluate sine 12 sine<%=t%>.png
convert sine<%=t%>.png histogram:sine_hist<%=t%>.png

convert sine<%=t%>.png  linear<%=t%>.png  -compose Multiply -composite  sine2<%=t%>.png
convert sine2<%=t%>.png histogram:sine2_hist<%=t%>.png

convert linear<%=t%>.png -negate -evaluate divide 2 bias<%=t%>.png
convert bias<%=t%>.png histogram:bias_hist<%=t%>.png

convert sine2<%=t%>.png bias<%=t%>.png -compose Plus -composite  attenuated<%=t%>.png
convert attenuated<%=t%>.png histogram:attenuated_hist<%=t%>.png

convert -size 5x300 gradient: -rotate 90 -function Polynomial -4,4,0 -evaluate Pow 0.5 circle_<%=t%>.png
convert circle_<%=t%>.png histogram:circle_hist<%=t%>.png

convert rose: rose<%=t%>.png
convert rose: histogram:rose_hist<%=t%>.png 

convert rose: -verbose -segment 100x3 rose_segments<%=t%>.png
convert rose_segments<%=t%>.png histogram:rose_segments_hist<%=t%>.png

convert fn.png fn<%=t%>.png
convert fn.png histogram:fn_hist<%=t%>.png
   
         `.trim(),
  },


  {
    name: 'playing with -fx and animations',
    description: ``,
    tags: [ExampleTag.animation, ExampleTag.morph],
    command: `
<%
const frameCount = 5
const frames = new Array(frameCount).fill(0).map((v,i)=>i+1)
const R=1.2

%>
convert fn.png -resize 120x80! img1.miff
convert img1.miff -edge 2 img1e.miff
convert img1e.miff img1.miff  -fx 'vv=u.p{i,j}>0.5?v.p{i, j}*2:v.p{i, j}/2; debug(u.p{i,j});  vv' img1W.miff 
convert rose: -resize 120x80! img2.miff
convert img2.miff -edge 2 img2e.miff
convert img2e.miff img2.miff  -fx 'vv=u.p{i,j}>0.5?v.p{i, j}*2:v.p{i, j}/2; debug(u.p{i,j});  vv' img2W.miff 
<%
frames.forEach(i=>{
%>
convert img1W.miff img2W.miff -fx 'vv=(u.p{i,j}/<%=i*R%> + v.p{i, j}*<%=i*R%>)/2; vv' out1_<%=i%>.miff
convert img2W.miff img1W.miff -fx 'vv=(u.p{i,j}/<%=i*R%> + v.p{i, j}*<%=i*R%>)/2;vv' out2_<%=i%>.miff
<%
})
%>
convert -loop 0 -delay 10 -morph 10 img1.miff  \\
  <%= frames.map(i=>\`out2_\${i}.miff\`).reverse().join(' ') %> <%= frames.map(i=>\`out1_\${i}.miff\`).join(' ') %> \\
  img2.miff <%= frames.map(i=>\`out1_\${i}.miff\`).reverse().join(' ') %> \\
  <%= frames.map(i=>\`out2_\${i}.miff\`).join(' ') %> img1.miff out3.gif


   
         `.trim(),
  },





  {
    name: 'gradient sparse_fill',
    description: `https://www.imagemagick.org/Usage/canvas/#sparse_fill`,
    tags: [ExampleTag.drawing, ExampleTag.gradient],
    command: `
    convert -size 100x100 xc:none +antialias -fill none -strokewidth 0.5 \\
    -stroke Gold        -draw 'path "M 20,70  A 1,1 0 0,1 80,50"' \\
    -stroke DodgerBlue  -draw 'line 30,10  50,80' \\
    -stroke Red         -draw 'circle 80,60  82,60' \\
    sparse_source.gif

    convert sparse_source.gif \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    \( +clone -resize 50% \) \\
    -layers RemoveDups -filter Gaussian -resize 100x100! -reverse \\
    -background None -flatten -alpha off    sparse_blur_pyramid.png

         `.trim(),
  },

  {
    name: 'Hourglass Distortion Map',
    description: `https://imagemagick.org/Usage/mapping/#hourglass`,
    tags: [ExampleTag.distort],
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
    tags: [ExampleTag.distort],
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
    tags: [ExampleTag.drawing],
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
    description: `use '-motion-blur' to create a field of falling stars`,
    command: `
convert -size 100x100 xc: +noise Random -channel R -threshold .4% \\
    -negate -channel RG -separate +channel \\
    \( +clone \) -compose multiply -flatten \\
    -virtual-pixel tile -blur 0x.4 -motion-blur 0x20+45 -normalize \\
    star_fall.gif

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

  //   // commented - not working :
  //   {
  //     name: 'star bursts',
  //     description: `Here we motion blur the stars in six directions (in pairs) then merge them together to create a field of 'star bursts', such as you get in a glass lens.`,
  //     command: `
  // convert -size 100x100 xc: +noise Random -channel R -threshold .2% \\
  //   -negate -channel RG -separate +channel \\
  //   \( +clone \) -compose multiply -flatten \\
  //   -virtual-pixel tile  -blur 0x.3 \\
  //   \( -clone 0  -motion-blur 0x10+15  -motion-blur 0x10+195 \) \\
  //   \( -clone 0  -motion-blur 0x10+75  -motion-blur 0x10+255 \) \\
  //   \( -clone 0  -motion-blur 0x10-45  -motion-blur 0x10+135 \) \\
  //   -compose screen -background black -flatten  -normalize \\
  //     -compose multiply -layers composite \\
  //     -set delay 30 -loop 0 -layers Optimize    \\
  //   star_field.gif`.trim(),
  //   },

  {
    name: 'stars animation',
    description: `By combining the above with a plasma glitter animation you can make set of stars that look like christmas decorations.`,
    tags: [ExampleTag.animation],
    command: `
convert -size 200x200 xc: +noise Random -separate \\
  null: \\
    ( xc: +noise Random -separate -threshold 50% -negate ) \\
    -compose CopyOpacity -layers composite \\
  null: \\
    plasma:red-firebrick plasma:red-firebrick plasma:red-firebrick plasma:red-firebrick plasma:red-firebrick \\
    -compose Screen -layers composite \\
  null:  \\
    ( xc: +noise Random -channel R -threshold 1% \\
      -negate -channel RG -separate +channel \\
      ( +clone ) -compose multiply -flatten \\
      -virtual-pixel tile  -blur 1x1 \\
      ( -clone 0  -motion-blur 111x135+90  -motion-blur 110x35-90 ) \\
      ( -clone 0  -motion-blur 10x15+30  -motion-blur 10x15-50 ) \\
      ( -clone 0  -motion-blur 10x15-30  -motion-blur 10x15+150 ) \\
      -compose screen -background black -flatten  -normalize ) \\
    -compose multiply -layers composite \\
  -set delay 30 -loop 0 -layers Optimize       \`uniqueName\`.gif

`.trim(),
  },

// didn't work as expected TODO:
//   {
//     name: '3d logo',
//     description: `https://www.imagemagick.org/Usage/advanced/#3d-logos`,
//     tags: [ExampleTag.drawing, ExampleTag['3d']],
//     command: `
//     buildFile helvetica.ttf font1
//     convert -alpha none -size 170x100 xc:black \\
//             -fill white -draw 'circle    50,50  13,50' \\
//                         -draw 'circle   120,50 157,50' \\
//                         -draw 'rectangle 50,13 120,87' \\
//             -fill black -draw 'circle    50,50  25,50' \\
//                         -draw 'circle   120,50 145,50' \\
//                         -draw 'rectangle 50,25 120,75' \\
//             -fill white -draw 'circle    60,50  40,50' \\
//                         -draw 'circle   110,50 130,50' \\
//                         -draw 'rectangle 60,30 110,70' \\
//             -gaussian 1x1 +matte logo_mask.png
    
// #  Now we use our mask to cut out the solid color of our logo, and add some text to generate a plain, solid color logo.
  
//     convert logo_mask.png -background red -alpha shape \\
//             -font font1  -pointsize 26  -fill white  -stroke black \\
//             -gravity Center  -annotate 0 "Ant" \\
//             logo.png
 
// #  Now lets give it a 3D-look, by using Overlay Highlighting techniques.
  
//     convert logo.png  -alpha extract -blur 0x6  -shade 110x30  -normalize \\
//             logo.png  -compose Overlay -composite \\
//             logo.png  -alpha on  -compose Dst_In  -composite \\
//             logo_3D.png
 
//  # Adding shadows is also easier thanks to the new Shadow Generation operator provided by IM.
  
//     convert logo_3D.png \( +clone -background navy -shadow 80x4+6+6 \) +swap \\
//             -background none  -layers merge +repage logo_3D_shadowed.png
  
//   #Just for fun lets finish by overlay our logo on a 'rough paper' like background. A huge number of other background canvases can also be created, see Background Examples for a collection of such examples.
  
//     convert logo_3D_shadowed.png \\
//             \( +clone +repage -alpha off -fx 'rand()' -shade 120x30 \\
//                -fill grey70 -colorize 60 \\
//                -fill lavender -tint 100 \) \\
//             +swap -composite logo_3D_bg.jpg
  
  
// `.trim(),
//   },

  {
        name: 'poligonize photo artistic',
        description: `the width of the initial image before polar distorting, basically sets the number of rays that will be produced`,
        tags: [ExampleTag.artistic, ExampleTag.effect],
        command: `
<% 
const size=10, 
speed=2,
intensity= 10
%>
convert \`buildFile https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60 photo1\` \\
  -resize <%= 100/speed%>% -blur 0x1 -colorspace YIQ -monitor \\
  -mean-shift <%= \`\${size}x\${size}%>+10% +monitor -set colorspace YIQ -colorspace sRGB \\
  -resize <%= 100*speed%>% \`uniqueName\`.png
    `.trim()
  },



  //   {
  //     name: 'radial flare',
  //     description: `the width of the initial image before polar distorting, basically sets the number of rays that will be produced`,
  //     command: `
  //     convert -size 100x1 xc: +noise Random -channel G -separate +channel \\
  //     -scale 100x100!                                +write flare_1a.png \\
  //     \( -size 100x100 gradient:gray(100%) -sigmoidal-contrast 10x50% \) \\
  //     -colorspace sRGB -compose hardlight -composite  +write flare_1b.png \\
  //     -virtual-pixel HorizontalTileEdge -distort Polar -1 \\
  //     flare_1_final.png
  // `.trim(),
  //   },

  //   {
  //     name: 'radial flare2',
  //     description: `another example using multiple overlays to achieve a different looking flare. Note the technique used to generating intermediate debugging and example images showing the steps involved.`,
  //     command: `
  // convert -size 100x1 xc: +noise Random -channel G -separate +channel \\
  //     -size 100x99 xc:black -append -motion-blur 0x35-90 \\
  //     \( -size 100x50 gradient:gray(0) \\
  //        -evaluate cos .5 -sigmoidal-contrast 3,100% \\
  //        -size 100x50 xc:gray(0) -append \) \\
  //     \( -size 1x50 xc:gray(0) \\
  //        -size 1x1 xc:gray(50%) \\
  //        -size 1x49 xc:gray(0) \\
  //        -append -blur 0x2 -scale 100x100! \) \\
  //     -scene 10 +write flare_2%x.png \\
  //     -background gray(0) -compose screen -flatten +write flare_2f.png \\
  //     -virtual-pixel HorizontalTileEdge -distort Polar -1 \\
  //     -colorspace sRGB flare_2_final.png
  // `.trim(),
  //   },

].map(m=>m)

let selectExampleCounter = 0

sampleCommandTemplates.forEach(template => {

  const example: Example = {
    name: template.name,
    description: template.description,
    async command(inputFiles: MagickInputFile[]) {
      const img = inputFiles[0]
      const info = await extractInfo(img)
      const context = { ...template.defaultTemplateContext, imageWidth: info[0].image.geometry.width, imageHeight: info[0].image.geometry.height }
      const result = template.template(context)
      return result.map(r => r.map(s => s === '$INPUT' ? img.name : s === '$OUTPUT' ? `output${selectExampleCounter++}.png` : s))
    },
  }
  commandExamples.push(example)

})
