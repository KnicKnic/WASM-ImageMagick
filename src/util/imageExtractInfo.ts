import { asInputFile, Call, MagickFile, blobToString, MagickInputFile } from '..'

/**
 * Execute `convert $IMG info.json` to extract image metadata. Returns the parsed info.json file contents
 * 
 * TODO: support several input images - we are already returning an array
 * @param img could be a string in case you want to extract information about built in images like `rose:`
 */
export async function extractInfo(img: MagickFile|string): Promise<ExtractInfoResult[]> {
  let name: string, imgs: MagickInputFile[]
  if(typeof img !=='string'){
    imgs = [await asInputFile(img)]
    name = imgs[0].name
  }
  else {
    name = img
    imgs = []
  }
  const processedFiles = await Call(imgs, ['convert', name, 'info.json'])
  try {
    return JSON.parse(await blobToString(processedFiles[0].blob))
  } catch(ex){
    return [{error: ex}]
  }
}

// the following is ExtractinfoResult json output as .d.ts using http://json2ts.com/ and manually fixing som eproblems / optionals 

export interface ExtractInfoResult {
  image?: ExtractInfoResultImage;
  error?: Error
}

export interface ExtractInfoResultGeometry {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ExtractInfoResultResolution {
  x: number;
  y: number;
}

export interface ExtractInfoResultPrintSize {
  x: number;
  y: number;
}

export interface ExtractInfoResultChannelDepth {
  alpha: number;
  red: number;
  green: number;
  blue: number;
}

export interface ExtractInfoResultOverall {
  min: number;
  max: number;
  mean: number;
  standardDeviation: number;
  kurtosis: number;
  skewness: number;
  entropy: number;
}

export interface ExtractInfoResultImageStatistics {
  Overall: ExtractInfoResultOverall;
}

export interface ExtractInfoResultAlpha {
  min: number;
  max: number;
  mean: number;
  standardDeviation: number;
  kurtosis: number;
  skewness: number;
  entropy: number;
}

export interface ExtractInfoResultRed {
  min: number;
  max: number;
  mean: number;
  standardDeviation: number;
  kurtosis: number;
  skewness: number;
  entropy: number;
}

export interface ExtractInfoResultGreen {
  min: number;
  max: number;
  mean: number;
  standardDeviation: number;
  kurtosis: number;
  skewness: number;
  entropy: number;
}

export interface ExtractInfoResultBlue {
  min: number;
  max: number;
  mean: number;
  standardDeviation: number;
  kurtosis: number;
  skewness: number;
  entropy: number;
}

export interface ExtractInfoResultChannelStatistics {
  Alpha: ExtractInfoResultAlpha;
  Red: ExtractInfoResultRed;
  Green: ExtractInfoResultGreen;
  Blue: ExtractInfoResultBlue;
}

export interface ExtractInfoResultRedPrimary {
  x: number;
  y: number;
}

export interface ExtractInfoResultGreenPrimary {
  x: number;
  y: number;
}

export interface ExtractInfoResultBluePrimary {
  x: number;
  y: number;
}

export interface ExtractInfoResultWhitePrimary {
  x: number;
  y: number;
}

export interface ExtractInfoResultChromaticity {
  redPrimary: ExtractInfoResultRedPrimary;
  greenPrimary: ExtractInfoResultGreenPrimary;
  bluePrimary: ExtractInfoResultBluePrimary;
  whitePrimary: ExtractInfoResultWhitePrimary;
}

export interface ExtractInfoResultPageGeometry {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ExtractInfoResultProperties {
  'date:create'?: Date;
  'date:modify'?: Date;
  signature?: string;
}

export interface ExtractInfoResult8bim2 {
  length: number;
}

export interface ExtractInfoResultProfiles {
  '8bim'?: ExtractInfoResult8bim2;
}

export interface ExtractInfoResultImage {
  name: string;
  baseName: string;
  format: string;
  formatDescription: string;
  mimeType: string;
  class: string;
  geometry: ExtractInfoResultGeometry;
  resolution: ExtractInfoResultResolution;
  printSize: ExtractInfoResultPrintSize;
  units: string;
  type: string;
  baseType: string;
  endianess: string;
  colorspace: string;
  depth: number;
  baseDepth: number;
  channelDepth: ExtractInfoResultChannelDepth;
  pixels: number;
  imageStatistics: ExtractInfoResultImageStatistics;
  channelStatistics: ExtractInfoResultChannelStatistics;
  alpha: string;
  renderingIntent: string;
  gamma: number;
  chromaticity: ExtractInfoResultChromaticity;
  matteColor: string;
  backgroundColor: string;
  borderColor: string;
  transparentColor: string;
  interlace: string;
  intensity: string;
  compose: string;
  pageGeometry: ExtractInfoResultPageGeometry;
  dispose: string;
  iterations: number;
  compression: string;
  orientation: string;
  properties: ExtractInfoResultProperties;
  profiles: ExtractInfoResultProfiles;
  tainted: boolean;
  filesize: string;
  numberPixels: string;
  pixelsPerSecond: string;
  userTime: string;
  elapsedTime: string;
  version: string;
}


