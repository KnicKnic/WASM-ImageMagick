import { ExecuteCommand, asCommand, Command, MagickInputFile, extractInfo } from 'wasm-imagemagick'
import { sampleCommandTemplates } from 'imagemagick-browser'

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
  distort
}

export const commandExamples: Example[] = [

  {
    name: 'identify simple',
    description: `runs identify program to print to stdout image info`,
    command: `identify rose:`.trim(),
    tags: [ExampleTag.info],
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
  -loop 0 animated_granularity.gif
`.trim(),
  },

  {
    name: 'extract pixel color',
    tags: [ExampleTag.info, ExampleTag.color],
    description: `extract pixel color at 0,0 and save it to info.txt file`,
    command: `convert logo: -format '%[pixel:p{0,0}]' info:$$UNIQUE_NAME.txt  `.trim(),
  },

  {
    name: 'extract image information',
    tags: [ExampleTag.info],
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
    tags: [ExampleTag.animation]
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
    +region lines_regions.gif
    `.trim(),
    tags: [ExampleTag.drawing]
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
  tags: [ExampleTag.append]
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
  $$UNIQUE_NAME.pdf
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
  -background SkyBlue -geometry -10+2  -tile x1  polaroid_overlap.jpg
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
    -compose SrcIn -composite  tint_overlay_pattern.png
         `.trim(),
  },


  {
    name: 'morph resize',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_resize`,
    tags: [ExampleTag.morph,ExampleTag.animation],
    command: `
    convert rose: $$IMAGE_0 -morph 10 \\
    -layers TrimBounds -set dispose previous -coalesce \\
    -background black -alpha remove \\
    -set delay '%[fx:(t>0&&t<n-1)?10:60]' \\
    -duplicate 1,-2-1  -loop 0  morph_resize.gif
    
         `.trim(),
  },
  {
    name: 'morph color',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_color`,
    tags: [ExampleTag.morph,ExampleTag.animation],
    command: `
    convert rose: $$IMAGE_0  -morph 5 \\
    -set delay '%[fx:(t>0&&t<n-1)?10:240]' \\
    -duplicate 1,-2-1    rose_flip_anim.gif
    
         `.trim(),
  },

  {
    name: 'morph tile',
    description: `https://www.imagemagick.org/Usage/anim_mods/#morph_color`,
    tags: [ExampleTag.morph,ExampleTag.animation],
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
    -loop 0 wipe_all.gif
    
         `.trim(),
  },
  {
    name: 'glitter_tiles tile',
    description: `https://www.imagemagick.org/Usage/anim_mods/#glitter_tiles`,
    tags: [ExampleTag.morph,ExampleTag.animation],
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
            -loop 0 -layers Optimize logo_glittered.gif
    
         `.trim(),
  },


    {
    name: 'animated distorts',
    description: `https://www.imagemagick.org/Usage/anim_mods/#distort`,
    tags: [ExampleTag.morph,ExampleTag.animation],
    command: `

    convert $$IMAGE_0  -duplicate 29  -virtual-pixel tile \\
    -distort SRT '0,0 1, 0, %[fx:w*t/n],%[fx:h*t/n]' \\
    -set delay 10 -loop 0     rose_diagonal_roll.gif

  convert $$IMAGE_0  -duplicate 29  -virtual-pixel Gray \\
    -distort SRT '%[fx:360*t/n]' \\
    -set delay '%[fx:t==0?240:10]' -loop 0     rose_rotate.gif
  
    
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
  -set delay 30 -loop 0 -layers Optimize       $$UNIQUE_NAME.gif

`.trim(),
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
      const result = template.template(context)
      return result.map(r => r.map(s => s === '$INPUT' ? img.name : s === '$OUTPUT' ? `output${selectExampleCounter++}.png` : s))
    },
  }
  commandExamples.push(example)

})
