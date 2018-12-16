investigate possibility os using libpng and zlib from emscripten ports
investigate supporting freetype from emscripten ports to support text. Is it only that library needed in order to render fonts ? }
investigate https://github.com/bgrins/videoconverter.js - that supports ffmpeg in the browser - could we use that as a IM delegate for processing video? 

 * fileOutput / input should be arrayBuffer ? https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Passing_data_by_transferring_ownership_(transferable_objects) -  https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast

 * maybe we can use https://github.com/coolwanglu/emscripten/tree/master/tests/poppler for reading pdfs - configure IM delegate

 * investigate if freetype from emscripten ports is compatible with what IM requires. there are some undefined symbols if using .h files from ports so my guess IM requires FT version 2 while the port is version 1.

 * TODO: be able to configure IM using xml files could be useful for the case of fonts so we don't have to load input files for each.

 * idea: a font manager app: convert ttf to preview image or gif animation. export ttf to svgs ? or to others

 * issue this doesn't work `convert foo.png \\ # a comment at the end of the line - could be empty`

 * build file should memoize

 * issue: if i dont put the second commend then it breaks and both commands get concatenated: 
 ```
   command: `# Heads up: we first build the input file of the font 
buildFile helvetica.ttf
# and then use it explicitly referencing it by file name:
convert -font helvetica.ttf -pointsize 132 -background lightblue \\
  -fill navy  'label:Sebastian Gurin IM Examples in the browser' \\
  -rotate 12 -virtual-pixel background -distort Arc 270 \\
  -trim -bordercolor lightblue -border 5x5  \`uniqueName\`.jpg
# next command 
convert -size 320x100 xc:lightblue -font helvetica.ttf -pointsize 72 \\
  -fill navy  -annotate +25+65 Anthony \\
  -background lightblue -rotate 85  -wave 2x5   -rotate -85 \\
  -gravity center  -crop 320x100+0+0 +repage \`uniqueName\`.jpg
  `,
  
  ```

  * enhancement : virtual command for delete images from execute result.outputFiles- use case: we are building an animation and we don't want frames to be outputed by execute() - Other use case: when dumping info to a file to parse it - or when loading a font file - we don't want those files to be in the output. the command could remove images by name or by index. Notice that IM already has a -delete operation to remove output files but this only happens on a single command and not on a execute composed command.

  * virtual command like uniqueName but with a parameter so other call() can reference it: 
```
convert rose: -rotate 6 \`uniqueName rotated1\`.png
convert \`uniqueName rotated1\`.png -resize 5% \`uniqueName img2\`.png
```
  basically uniqueName foo will return the same id when in the same execute(). Tip: use executionId+givenName

  Why? because convert will fail silently if using an existing file or writing to an existing input file and in execute() we probably have lots of call() and we want to reference files by name and also want unique names. 

 * check: IM scripts examples: https://www.imagemagick.org/Usage/scripts/

 * documentation here is wrong: https://www.imagemagick.org/Usage/draw/#svg_drivers - you cannot read .svg files with msvg - the example fails. you can only write. But, what if we write to svg, resize and then if it's possible to render the svg in canvas or to extract the picmap from svg image - then we could also perform the read svg part and can resize without aliasing as in  https://www.imagemagick.org/Usage/draw/#svg_output

 virtuall command for getting the color of x,y 
 