/*

The idea is that the user can put placeholders or wildcards in its execute commands to refer to existing images, to create unique names, etc.
Done: refer to exiting images by index, refer to all images, create unique names
TODO/ ideas :
 * if user / transformation defines some parameters then command able to access its values (user given). Imagine a command for extract pixel color that user gives x, y could be:
 *
 * be able to declare variables: imagine: commands: `
 * convert $$IMAGE_0 -format '%[pixel:p{$$USER_x, $$USER_y}]' info:$$UNIQUE_NAME.txt
$$SET_VAR_FROM OUTPUT_FILE_0_CONTENT backgroundColor=\`
  convert $$IMAGE_0 -format '%[pixel:p{0,0}]' info:$$UNIQUE_NAME.txt
\`
$$SET_VAR_FROM OUTPUT_FILE_0_NAME auxFile = \`
\`
    `
  ]
*/
import { MagickFile } from './magickApi'
import { ExecuteConfig } from './execute'
import { isImage } from './util/file'

export interface CommandContext {
  commands: string[][],
  files: MagickFile[],
  defaultImage?: MagickFile
  placeholders?: CommandContextPlaceholders
}
export interface CommandContextPlaceholders {
  singleImagePrefix?: string,
  allImages?: string,
  imageWidth?: string
  imageHeight?: string
  uniqueName?: string
}
export const defaultPlaceholders: CommandContextPlaceholders = {
  singleImagePrefix: '$$IMAGE_',
  allImages: '$$ALLIMAGES',
  imageWidth: '$$IMAGE_WIDTH',
  imageHeight: '$$IMAGE_HEIGHT',
  uniqueName: '$$UNIQUE_NAME',
}
export function renderCommand(config: CommandContext): string[][] {
  const { commands, files, placeholders = defaultPlaceholders, defaultImage = files[0] } = config
  const { singleImagePrefix, allImages, uniqueName } = placeholders

  // simple string replacement for placeholders singleImagePrefix and uniqueName
  const cmd = commands.map(c =>
    c.map(arg => {
      if (arg.startsWith(singleImagePrefix)) {
        const match = files[parseInt(arg.substring(singleImagePrefix.length, arg.length), 10)] || defaultImage || { name: 'rose:' }
        return match.name
      }
      if (arg.startsWith(uniqueName)) {
        return getUniqueName(config, arg)
      }
      return arg
    }),
  )

  // add placeholders.allImageNames
  const allImageNames = files.map(f => isImage(f) ? f.name : false).filter(a => a) as string[]
  cmd.forEach(c => {
    const allIndexes = c.map((arg, i) => arg === allImages ? i : undefined).filter(arg => typeof arg !== 'undefined')
    allIndexes.forEach(i => c.splice(i, 1, ...allImageNames)) // add all image names and remove $$ALLIMAGE arg
  })
  return cmd
}

export interface ExecuteContextPlaceholders extends CommandContextPlaceholders, ExecuteConfig {

}
export interface ExecuteContext extends CommandContext {
  placeholders: ExecuteContextPlaceholders
}

export async function  renderExecuteConfig(config: ExecuteContext): Promise<ExecuteConfig> {
  return {...config}
}

export
let counter = 0
function getUniqueName(c: CommandContext, arg: string): string {
  const { commands, files, placeholders = defaultPlaceholders, defaultImage = files[0] } = c
  const { singleImagePrefix, allImages, uniqueName } = placeholders
  return 'f1l3_' + (counter++) + arg.substring(uniqueName.length, arg.length)
}
