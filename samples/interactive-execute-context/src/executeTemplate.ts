/*
syntax enhancement for the demo - temporary
*/
import { MagickFile, isImage as isImageFile } from 'wasm-imagemagick'
import { ExecuteConfig } from 'imagemagick-browser'

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
      if (arg.includes(uniqueName)) {
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

const isImageMap = {}
async function isImage(f): Promise<boolean> {
  if(typeof isImageMap[f.name] === 'undefined') {
    const is= await isImageFile(f)
    isImageMap[f.name] = is
    return is
  }
  else {
    isImageMap[f.name]
  }
}
export interface ExecuteContextPlaceholders extends CommandContextPlaceholders, ExecuteConfig {

}
export interface ExecuteContext extends CommandContext {
  placeholders: ExecuteContextPlaceholders
}

// export async function  renderExecuteConfig(config: ExecuteContext): Promise<ExecuteConfig> {
//   return {...config}
// }

export
let counter = 0
function getUniqueName(c: CommandContext, arg: string): string {
  const { commands, files, placeholders = defaultPlaceholders, defaultImage = files[0] } = c
  const { singleImagePrefix, allImages, uniqueName } = placeholders
  return arg.substring(0, arg.indexOf(uniqueName))+'f1l3_' + (counter++) + arg.substring(arg.indexOf(uniqueName)+uniqueName.length, arg.length)
}
