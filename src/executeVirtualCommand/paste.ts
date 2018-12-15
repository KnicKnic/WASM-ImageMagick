import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile, cutShape, paste } from '../util'
import { VirtualCommandContext, VirtualCommand, _newExecuteResult } from './VirtualCommand'
import pMap from 'p-map';
import { getUniqueIdentifier } from './uniqueName';
import { buildExecuteResultWithError } from '../execute';

/**
 * paste command: simulates image paste region. Usage: 
 * 
 * ```paste bigImage.miff 50x60 smallerImage.miff resultNewImage.miff```
 * 
 * Paste smallerImage into bigImage at 50x60 position.
 * 
 * The last argument is optional. If dont' explicit then the first image (bigImage) will be modified and no 
 * additional images will be created. If explicit then bigImage won¿t be modified and the result will be placed 
 * in that path (resultNewImage)
 * 
 * If the second argument (smallerImage) is not explicit (or an empty string) then it will try to use whaever 
 * the last "cut" operation did in this execute(). If none, then does nothing. For example: 
 * 
 * ```
 * cut bigImage.miff 'rectangle 40,50 200,100' output.png fragment.miff
 * paste big.miff 12x34 ''  foo.png
 * ```
 * 
 * That last paste will  put `frament.miff at 12x34 of big.miff but without modifying big, but output the 
 * result in a new one foo.png. Useful when you work with this two tools together and you don't care to remember wjich files you used. 
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
    const where = c.command[2]
    const toPasteImageName = c.command[3]
    const toPasteImage = c.files[toPasteImageName]
    const declaredResultImageName = c.command[4]
    
    const resultImageName = declaredResultImageName|| 'temp_'+getUniqueIdentifier()+'.miff' // TODO: same format of source image

    const { modified, result} = await paste(targetImage, toPasteImage, 
      parseInt(unquote(where.split('x')[0]), 10), parseInt(unquote(where.split('x')[1]), 10), 
      resultImageName, undefined, undefined, c.executionId)

    return _newExecuteResult(c, {
      ...result,
      outputFiles: await pMap([modified], f => asOutputFile(f)),
      manipulateFiles: declaredResultImageName ? [] : [
        {type: 'replace', existingFileName: targetImageName, newOutputFileName: resultImageName}
      ]
    })
    //TODO: ceck errors, stdout, stderr, etc

  },
  validateCommands(c: VirtualCommandContext): false|string {
    if(c.command.length<3 || !c.command[1] || !c.command[2]){
      return 'You need to pass at least 2 params: the target image and where to paste the thing.'
    }
  }
} as VirtualCommand


// TODO: test of replace and the other features: 
// # paste replace existing files test

// convert rose: -rotate 77 1.miff
// convert 1.miff 2.miff
// convert rose: -resize 33% -rotate -44 small.miff

// paste 1.miff  30x40 small.miff

// paste 1.miff '' '' 