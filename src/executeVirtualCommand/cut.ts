import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';
import { getUniqueIdentifier } from './uniqueName';

/**
 * cut command: simulates image cut region. Usage: 
 * 
 * ```cut bigImage.miff 'rectangle 40,50 200,100' bigImageCutted.miff sectionCut.miff```
 * 
 * When finish it there will be two new files in the execution chain: bigImageCutted.miff that has the 
 * modified image with the region cutted totally transparent and sectionCut.miff: an image containing the section cutted.
 * 
 * If bitImageCutted is not explicit (empty string) then bigImage itself will be modified, otherwhise not. SectionCut 
 * is also optional- if not passed a new image with unique name will be generated.
 * Heads up ! 
 *  * second param is a string with a MVG simple shape
 *  * this two new images must not exist. 
 * 
 * TODO: second param could be an existing image name - if it's invalid shape sytax we use that file as mask
 * TODO: should we modify the sourceImage content instead of returning bigImageCutted ? 
 */
export default {
  name: 'cut',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'cut'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const targetImageName = c.command[1]
    const targetImage = c.files[targetImageName]
    const shape = c.command[2]

    const declaredTargetImageModifiedOutputName = c.command[4]
    
    const argetImageModifiedOuputName = declaredTargetImageModifiedOutputName|| 'temp_'+getUniqueIdentifier()+'.miff' // TODO: same format of source image

    const targetImageModifiedName = c.command[3]
    const sectionCutName = c.command[4]
    const { modifiedFile, sectionFile, results } = await cutShape(targetImage, shape, 
      targetImageModifiedName, sectionCutName, undefined, c.executionId)

    return _newExecuteResult(c, {
      ...results[2],
      outputFiles: await pMap([modifiedFile, sectionFile], f => asOutputFile(f)),
      results, 
      manipulateFiles: argetImageModifiedOuputName ? [] : [
        {
          type: 'replace', 
        existingFileName: targetImageName, 
        newOutputFileName: argetImageModifiedOuputName 
      }
      ]
    })
    //TODO: ceck errors, stdout, stderr, etc

  },
  validateCommands(c: VirtualCommandContext): false|string {
    if(c.command.length<3 || !c.command[1] || !c.command[2]){
      return 'You need to pass at least 2 params: the target image and where to cut.'
    }
  }
} as VirtualCommand
