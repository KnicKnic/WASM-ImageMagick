import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape, paste } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';
import { Point } from '../util/draw';
import { parse } from 'handlebars';
import { FillColorConfig, fillColorConvert } from '../util/color';
import { execute } from '../execute';

/**
 * floodfill img.miff 12x44 '#ededed' outputImage.miff 30%
 */
export default {
  name: 'floodfill',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'floodfill'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const targetImageName = c.command[1]
    const targetImage = c.files[targetImageName]
    const pointStr = c.command[2]
    const floodfillPoint: Point = {x: parseInt(pointStr.split('x')[0], 10), y:  parseInt(pointStr.split('y')[1], 10)} // TODO: move to cli util parsePoint() and sprintPoint()
    const fill = c.command[3]
    const outputFileName = c.command[4]

    const config : FillColorConfig={
      fill, outputFileName, fillMode: 'floodfill',  floodfillPoint, 
    } 
    const result = await execute({inputFiles: [targetImage], commands: await fillColorConvert.commandBuilder(config)} )


    // const { modified, result} = await paste(targetImage, toPasteImage, 
    //   parseInt(unquote(where.split('x')[0]), 10), parseInt(unquote(where.split('x')[1]), 10), 
    //   resultImageName, undefined, undefined, c.executionId)

    return _newExecuteResult(c, {
      ...result,
      outputFiles: await pMap([modified], f => asOutputFile(f)),
    })
    //TODO: ceck errors, stdout, stderr, etc

  },
} as VirtualCommand
