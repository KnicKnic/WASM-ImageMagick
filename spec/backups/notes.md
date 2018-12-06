investigate possibility os using libpng and zlib from emscripten ports
investigate supporting freetype from emscripten ports to support text. Is it only that library needed in order to render fonts ? }
investigate https://github.com/bgrins/videoconverter.js - that supports ffmpeg in the browser - could we use that as a IM delegate for processing video? 

 * fileOutput / input should be arrayBuffer ? https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Passing_data_by_transferring_ownership_(transferable_objects) -  https://developers.google.com/web/updates/2011/12/Transferable-Objects-Lightning-Fast

 * maybe we can use https://github.com/coolwanglu/emscripten/tree/master/tests/poppler for reading pdfs - configure IM delegate

 * investigate if freetype from emscripten ports is compatible with what IM requires. there are some undefined symbols if using .h files from ports so my guess IM requires FT version 2 while the port is version 1.

 * TODO: be able to configure IM using xml files could be useful for the case of fonts so we don't have to load input files for each.

 * idea: a font manager app: convert ttf to preview image or gif animation. export ttf to svgs ? or to others