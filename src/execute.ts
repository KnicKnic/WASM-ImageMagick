import { MagickInputFile, MagickOutputFile, outputFileToInputFile, call, asCommand } from '.'
import pMap from 'p-map'
import { CallResult } from './magickApi'
import { values } from './util/misc';

export type Command = (string | number)[]

export interface ExecuteConfig {
  inputFiles?: MagickInputFile[]
  /** commands could be array form like [['convert', 'foo.png', 'bar.gif']] or CLI form like ['convert foo.png bar.gif'] */
  commands: ExecuteCommand
}

export type ExecuteCommand = Command[] | string[] | string

export interface ExecuteResultOne extends CallResult {
  // outputFiles: MagickOutputFile[]
  errors: any[]
  // stderr: string[]
  // stdout: string[]
  exitCode: number
}

/** execute first command in given config */
export async function executeOne(configOrCommand: ExecuteConfig | ExecuteCommand): Promise<ExecuteResultOne> {
  const config = asExecuteConfig(configOrCommand)
  let result: CallResult = {
    stderr: [],
    stdout: [],
    outputFiles: [],
    exitCode: 1,
  }
  try {
    config.inputFiles = config.inputFiles || []
    const command = asCommand(config.commands)[0]
    const t0 = performance.now()
    executeListeners.forEach(listener => listener.beforeExecute({ command, took: performance.now() - t0, id: t0 }))
    result = await call(config.inputFiles, command.map(c => c + ''))
    executeListeners.forEach(listener => listener.afterExecute({ command, took: performance.now() - t0, id: t0 }))
    if (result.exitCode) {
      return { ...result, errors: ['exit code: ' + result.exitCode + ' stderr: ' + result.stderr.join('\n')] }
    }
    return { ...result, errors: [undefined] }

  } catch (error) {
    return { ...result, errors: [error + ', exit code: ' + result.exitCode + ', stderr: ' + result.stderr.join('\n')] }
  }
}

export function isExecuteCommand(arg: any): arg is ExecuteConfig {
  return !!arg.commands
}

export function asExecuteConfig(arg: ExecuteConfig | ExecuteCommand): ExecuteConfig {
  if (isExecuteCommand(arg)) {
    return arg
  }
  return {
    inputFiles: [], 
    commands: arg,
  }
}
/**
 * Assumes the command won't fail so returns one output file directly or undefined if it's not found (or error occurs)
 * @param configOrCommand 
 * @param outputFileName optionally user can give the desired output file name
 */
export async function executeAndReturnOutputFile(configOrCommand: ExecuteConfig | ExecuteCommand, outputFileName?: string): Promise<MagickOutputFile | undefined> {
  const config = asExecuteConfig(configOrCommand)
  const result = await execute(config)
  return outputFileName ? result.outputFiles.find(f => f.name === outputFileName) : result.outputFiles.length && result.outputFiles[0]
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

export interface ExecuteResult extends ExecuteResultOne {
  results: ExecuteResultOne[]
  breakOnError?: boolean
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

export async function execute(configOrCommand: ExecuteConfig | ExecuteCommand): Promise<ExecuteResult> {
  const config = asExecuteConfig(configOrCommand)
  config.inputFiles = config.inputFiles || []
  const allOutputFiles: { [name: string]: MagickOutputFile } = {}
  const allInputFiles: { [name: string]: MagickInputFile } = {}
  config.inputFiles.forEach(f => {
    allInputFiles[f.name] = f
  })
  let allErrors = []
  const results: ExecuteResultOne[] = []
  let allStdout = []
  let allStderr = []
  async function mapper(c: Command) {
    const thisConfig = {
      inputFiles: values(allInputFiles),
      commands: [c],
    }
    const result = await executeOne(thisConfig)
    results.push(result)
    allErrors = allErrors.concat(result.errors || [])
    allStdout = allStdout.concat(result.stdout || [])
    allStderr = allStderr.concat(result.stderr || [])
    await pMap(result.outputFiles, async f => {
      allOutputFiles[f.name] = f
      const inputFile = await outputFileToInputFile(f)
      allInputFiles[inputFile.name] = inputFile
    })
  }
  const commands = asCommand(config.commands)
  await pMap(commands, mapper, { concurrency: 1 })
  const resultWithError = results.find(r => r.exitCode !== 0)
  return {
    outputFiles: values(allOutputFiles),
    errors: allErrors,
    results,
    stdout: allStdout,
    stderr: allStderr,
    exitCode: resultWithError ? resultWithError.exitCode : 0,
  }
}

