import { execute } from '../'

export async function getConfigureFolders(): Promise<string[]> {
  const result = await execute(`convert -debug configure rose: info:`)
  const contains = `Searching for configure file:`
  const folders = result.stderr
    .filter(line => line.includes(contains))
    .map(line => line.substring(line.indexOf(contains) + contains.length, line.length))
    .map(s => s.replace(/\/\//g, '/'))
    .map(s => s.substring(0, s.lastIndexOf('/')))
    .map(s => s.replace(/"/g, '').trim())
  return folders

}

// has some heuristic information regarding features (not) supported by wasm-imagemagick, for example, image formats

// heads up - all images spec/assets/to_rotate.* where converted using gimp unless explicitly saying otherwise
/**
 * list of image formats that are known to be supported by wasm-imagemagick. See `spec/formatSpec.ts`
 */
export const knownSupportedReadWriteImageFormats = [
  'jpg', 'png',
  'psd',
  'tiff', 'xcf', 'gif', 'bmp', 'tga', 'miff', 'ico', 'dcm', 'xpm', 'pcx',
  //  'pix', // gives error
  'fits',
  // 'djvu', // read only support
  'ppm',
  'pgm',
  'pfm',
  'mng',
  'hdr',
  'dds', // generated using convert -define "dds:compression={dxt1, dxt5, none}" to_rotate.png  to_rotate.dds
  'otb', // generated using convert to_rotate.png  to_rotate.otb

  'txt', // generated using convert to_rotate.png  to_rotate.txt

  // 'rgb', // fails because  MustSpecifyImageSize `to_rotate.rgb'
]
