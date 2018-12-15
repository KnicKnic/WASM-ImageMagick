import { execute } from '../'
import { isMagickFile, getFileNameExtension } from './file';
import { MagickFile } from '../magickApi';

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
 * list of image formats that are known to be supported by wasm-imagemagick both for read and write. See `spec/formatSpec.ts`
 */
export const knownSupportedReadWriteImageFormats = [
  'jpg', 'png',
  'psd',
  // 'webp',// should be working but it's not : ImageMagick/coders/webp.c
  'tiff', 'xcf', 'gif', 'bmp', 'tga', 'miff', 'ico', 'dcm', 'xpm', 'pcx',
  'fits',
  'ppm',
  'pgm',
  'pfm',
  'mng',
  'hdr',
  'dds', // generated using convert -define "dds:compression={dxt1, dxt5, none}" to_rotate.png  to_rotate.dds
  'otb', // generated using convert to_rotate.png  to_rotate.otb

  'txt', // generated using convert to_rotate.png  to_rotate.txt
  'psb',

  // 'rgb', // fails because  MustSpecifyImageSize `to_rotate.rgb'
]

/**
 * list of image formats that are known to be supported by wasm-imagemagick but only for write operation. See `spec/formatSpec.ts`
 */
export const knownSupportedWriteOnlyImageFormats = [
  'ps', 'pdf',
  'epdf', // generated using convert to_rotate.png  to_rotate.epdf
  'svg',
  'djvu', // converted from png using online tool
]

/**
 * list of image formats that are known to be supported by wasm-imagemagick but only for read operation. See `spec/formatSpec.ts`
 */
export const knownSupportedReadOnlyImageFormats = [
  // 'pix',
  'mat',
]

export const _knownSupportedImageFormatsInFolderForTest = [
  'mat',
]

export function isReadable(f: MagickFile | string): boolean {
  const s = isMagickFile(f) ? f.name : f
  return knownSupportedWriteOnlyImageFormats.indexOf(getFileNameExtension(s)) === -1
}

