import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape, paste } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';
import { Point } from '../util/draw';
import { parse } from 'handlebars';
import { FillColorConfig, fillColorConvert, Color } from '../util/color';
import { execute } from '../execute';
import { getUniqueIdentifier } from './uniqueName';

/**
 * fill flood img.miff 12x44 '#ededed' 30% outputImage.miff 
 * fill opaque img.miff #ed5544 #edrree 30% outputImage
 * 
 * in both cases the last outputImage is optional - if provided the result will be there and if not the img.miff will be modified itself. 
 * 
 * The thressold parameter (30% ) is optional 
 */
export default {
  name: 'fill',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'fill'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const fillMode = c.command[1] === 'opaque' ? 'opaque' : 'flood'
    const targetImageName = c.command[2]
    const targetImage = c.files[targetImageName]
    let pointOrColor = c.command[3] // could be flood point or opaque color
    let floodPoint: Point
    let opaqueColor: Color
    if (fillMode === 'flood') {
      floodPoint = { x: parseInt(pointOrColor.split('x')[0], 10), y: parseInt(pointOrColor.split('x')[1], 10) } // TODO: move to cli util parsePoint() and sprintPoint()
    }
    else {
      opaqueColor = pointOrColor
    }
    const fill = c.command[4]
    const fuzz = c.command[5]
    const declaredOutputFileName = c.command[6]
    const outputFileName = declaredOutputFileName || 'temp_' + getUniqueIdentifier() + '.miff' // TODO: same format of source image


    const config: FillColorConfig = {
      fill, outputFileName, fillMode, floodPoint, targetImage, opaqueColor
    }
    const commands = await fillColorConvert.commandBuilder(config)
    const result = await execute({ inputFiles: [targetImage], commands })

    return _newExecuteResult(c, {
      ...result,
      manipulateFiles: declaredOutputFileName ? [] : [
        { type: 'replace', existingFileName: targetImageName, newOutputFileName: outputFileName }
      ]
    })

  },

  validateCommands(c: VirtualCommandContext): false | string {
    if (c.command.length < 5 || c.command.filter(c => c).length < 5) {
      return 'You need to pass at least 2 params: the target image and where to fill the thing.'
    }
    //TODO: more errors here
  }
} as VirtualCommand
