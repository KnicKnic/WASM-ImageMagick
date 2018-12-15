import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape, paste } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';

/**
 * paste command: simulates image paste region. Usage: 
 * 
 * ```paste bigImage.miff smallerImage.miff 50x60  resultNewImage.miff```
 * 
 * When finish it there will be a new file esultNewImage.miff containing bigImage composed with smallerImage in given coordinates
 * 
 * Heads up ! resultNewImage.miff must not exist. 
 * 
 * TODO: should we modify the sourceImage content instead of returning bigImagepasteted ? 
 */
export default {
  name: 'paste',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'paste'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const targetImageName = c.command[1]
    const targetImage = c.files[targetImageName]
    const toPasteImageName = c.command[2]
    const toPasteImage = c.files[toPasteImageName]
    const where = c.command[3]
    const resultImageName = c.command[4]
    const { modified, result} = await paste(targetImage, toPasteImage, 
      parseInt(unquote(where.split('x')[0]), 10), parseInt(unquote(where.split('x')[1]), 10), 
      resultImageName, undefined, undefined, c.executionId)

    return _newExecuteResult(c, {
      ...result,
      outputFiles: await pMap([modified], f => asOutputFile(f)),
    })
    //TODO: ceck errors, stdout, stderr, etc

  },
} as VirtualCommand
