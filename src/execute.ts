import { MagickInputFile, MagickOutputFile, outputFileToInputFile, Call, asCommand } from '.'
import pMap from 'p-map'

export type Command = (string | number)[]

export interface ExecuteConfig {
  inputFiles?: MagickInputFile[]
  /** commands could be array form like [['convert', 'foo.png', 'bar.gif']] or CLI form like ['convert foo.png bar.gif'] */
  commands: ExecuteCommand
}

export type ExecuteCommand = Command[] | string[] | string

export interface ExecuteResult {
  outputFiles: MagickOutputFile[]
  errors?: any[]
}

/** execute first command in given config */
export async function executeOne(config: ExecuteConfig): Promise<ExecuteResult> {
  try {
    config.inputFiles = config.inputFiles || []
    const command = asCommand(config.commands)[0]
    const t0 = performance.now()
    executeListeners.forEach(listener => listener.beforeExecute({ command, took: performance.now() - t0, id: t0 }))
    const result = { outputFiles: await Call(config.inputFiles, command.map(c => c + '')) }
    executeListeners.forEach(listener => listener.afterExecute({ command, took: performance.now() - t0, id: t0 }))
    return result

  } catch (error) {
    return { outputFiles: [], errors: [error] }
  }
}

// execute event emitter

export interface ExecuteEvent {
  command: Command
  took: number
  id: number
}
export interface ExecuteListener {
  afterExecute?(event: ExecuteEvent): void
  beforeExecute?(event: ExecuteEvent): void
}
const executeListeners: ExecuteListener[] = []
export function addExecuteListener(l: ExecuteListener) {
  executeListeners.push(l)
}

/**
 * Execute all commands in given config serially in order. Output files from a command become available as
 * input files in next commands. The execution result will contain all generated outputFiles. If same file name
 * is used later command output files will override previous ones. Example:
 *
 * ```ts
 * const {outputFiles} = await execute({
 *  inputFiles: [await buildInputFile('fn.png', 'image1.png')],
 *  commands: [
 *    ['convert', 'image1.png', "-bordercolor", "#ffee44", "-background", "#eeff55", "+polaroid", "image2.png"],
 *    // heads up: next command uses "image2.png" which was the output of previous command:
 *    ["convert", "image2.png", "-fill", "#997711", "-tint", "55"],
 *  ]
 * })
 * ```
 *
 * An alternative syntax with CLI-like strings is also supported:
 *
 * ```ts
 * const {outputFiles} = await execute({inputFiles: [], commands: [
 *   'convert rose: -rotate 70 image2.gif',
 *   'convert image2.gif -resize 33 image3.gif'
 * ] })
 * ```
 *
 * Or if it's only one command using just a string:
 *
 * ```ts
 * const {outputFiles} = await execute({inputFiles: [foo], commands: `convert 'my face image.png' \\( +clone -channel R -fx B \\) +swap -channel B -fx v.R bar.gif`})
 * ```
 *
 * Note: in string syntax you must use single quotes for CLI arguments that need so (like 'my face image.png'). no multiline with \ is supported.
 *
 * ```
 */
export async function execute(config: ExecuteConfig): Promise<ExecuteResult> {
  config.inputFiles = config.inputFiles || []
  const allOutputFiles: { [name: string]: MagickOutputFile } = {}
  const allInputFiles: { [name: string]: MagickInputFile } = {}
  config.inputFiles.forEach(f => {
    allInputFiles[f.name] = f
  })
  let allErrors = []
  async function mapper(c: Command) {
    const thisConfig = {
      inputFiles: Object.keys(allInputFiles).map(name => allInputFiles[name]),
      commands: [c],
    }
    const result = await executeOne(thisConfig)
    await pMap(result.outputFiles, async f => {
      allOutputFiles[f.name] = f
      const inputFile = await outputFileToInputFile(f)
      allInputFiles[inputFile.name] = inputFile
    })
    allErrors = allErrors.concat(result.errors)
  }
  const commands = asCommand(config.commands)
  await pMap(commands, mapper, { concurrency: 1 })
  return {
    outputFiles: Object.keys(allOutputFiles).map(name => allOutputFiles[name]),
    errors: allErrors,
  }
}
