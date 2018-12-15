import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape, paste } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';
import { getUniqueIdentifier } from './uniqueName';

/**
 * paste command: simulates image paste region. Usage: 
 * 
 * ```paste bigImage.miff smallerImage.miff 50x60  resultNewImage.miff```
 * 
 * The last argument is optional. If dont' explicit then the first image (bigImage) will be modified and no 
 * additional images will be created. If explicit then bigImage won¿t be modified and the result will be placed 
 * in that path (resultNewImage)
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
    const declaredResultImageName = c.command[4]
    
    const resultImageName = declaredResultImageName|| 'temp_'+getUniqueIdentifier()+'.miff' // TODO: same format of source image

    const { modified, result} = await paste(targetImage, toPasteImage, 
      parseInt(unquote(where.split('x')[0]), 10), parseInt(unquote(where.split('x')[1]), 10), 
      resultImageName, undefined, undefined, c.executionId)

    return _newExecuteResult(c, {
      ...result,
      outputFiles: await pMap([modified], f => asOutputFile(f)),
      replaceFiles: declaredResultImageName ? [] : [
        {existingFileName: targetImageName, newOutputFileName: resultImageName}
      ]
    })
    //TODO: ceck errors, stdout, stderr, etc

  },
} as VirtualCommand
