import { Point } from "./draw";
import { MagickFile } from "../magickApi";
import { ExecuteResult, ExecuteCommand } from "../execute";


export interface SimpleConvert<Config extends SimpleConvertConfig> {
  name: string, description: string
  commandBuilder?: SimpleConvertCommandBuilder<Config>
}

export type SimpleConvertCommandBuilder<Config extends SimpleConvertConfig> = (config: Config) => Promise<ExecuteCommand>

/** generic convert command configuraiton for high level programatic APIs. convert is a very flexible way - this type only covers those commands that are applied to an existing image and as a result create one or more new output images  */
export interface SimpleConvertConfig {
  /** the image that will be converted. In general this is not true and this image won't be modified but the conversion result will be output in the file with name ``outputFileName */
  targetImage?: MagickFile

  /** image file to be created as a result of applying this conversion to file `targetImage` */
  outputFileName?: string

  /** in case users don't care of naming the output files they can specify frmat */
  defaultOutputExtension?: string
}

export type Color = string



// high level utilities related to colors

export interface FillColorConfig extends SimpleConvertConfig {
  targetImage: MagickFile // mandatory here

  // outputFileName: string

  /**flood' requires a point and from there it will start filling neibors while 'opaque' will just replace any pixel with fill color */
  fillMode: 'flood' | 'opaque'
  /** The color to fill in */
  fill: Color
  /** Required in case fillMode=='opaque */
  opaqueColor?: Color
  /** tolerance when matching similar colors - apply for both modes */
  fuzz?: number
  /** applies for flood mode - the point where to start filling from */
  floodPoint?: Point

}
const fillColor: SimpleConvertCommandBuilder<FillColorConfig> = async config => {
  config.floodPoint = config.floodPoint || { x: 0, y: 0 }
  const floodFragment = `-floodfill +${config.floodPoint.x}+${config.floodPoint.y} \\
  \`convert '${config.targetImage.name}' -format '%[pixel:p{${config.floodPoint.x},${config.floodPoint.y}}]\\n' info:\``

  const opaqueFragment = `-opaque ${config.opaqueColor || 'white'}`

  const command = `
  convert '${config.targetImage.name}' -alpha set -fuzz ${config.fuzz || 10}% -fill ${config.fill} \\
    ${config.fillMode === 'flood' ? floodFragment : opaqueFragment} ${config.outputFileName || '`uniqueName`.' + config.defaultOutputExtension || SimpleConvertDefaultExtension}
    `
  return command
}

const SimpleConvertDefaultExtension = 'miff'

/** simple fill color tool that supports two modes - flood (starting from one point following it siblings and opaque - fill every point withing the threshold) */
export const fillColorConvert: SimpleConvert<FillColorConfig> = {
  name: 'Fill Color Convert', description: `simple fill color tool that supports two modes - flood (starting from one point following it siblings and opaque - fill every point withing the threshold)`,
  commandBuilder: fillColor
}