import pMap from 'p-map'
import { execute, ExecuteResult } from './execute'
import { MagickInputFile, MagickOutputFile } from './magickApi'
import { asInputFile, asOutputFile, buildInputFile, readFileAsText, unquote, values } from './util'
// import * as Minimatch from 'minimatch';
const Minimatch = require('minimatch')

// TODO: variable declaration

export interface VirtualCommandContext {
  command: string[]
  files: { [name: string]: MagickInputFile }
  executionId: number
}
export function isVirtualCommand(context: VirtualCommandContext): boolean {
  return !!virtualCommands.find(c => c.predicate(context))

}

export function dispatchVirtualCommand(context: VirtualCommandContext): Promise<ExecuteResult> {
  const cmd = virtualCommands.find(c => c.predicate(context))
  return cmd.execute(context)
}

const virtualCommands: VirtualCommand[] = []

export interface VirtualCommand {
  name: string
  execute(c: VirtualCommandContext): Promise<ExecuteResult>
  predicate(c: VirtualCommandContext): boolean
}
export function registerVirtualCommand(c: VirtualCommand) {
  virtualCommands.push(c)
}

registerVirtualCommand({
  name: 'ls',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'ls'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const target = unquote(c.command[1])
    const stdout = Object.keys(c.files).filter(f => Minimatch(f, target))
    const result: ExecuteResult = {
      stderr: target.includes('*') ? [] : stdout.length ? [] : [target + ' not found.'],
      stdout,
      exitCode: target.includes('*') ? 0 : stdout.length > 0 ? 0 : 1, outputFiles: [],
      command: c.command, commands: [c.command],
      inputFiles: values(c.files), results: [],
    }
    result.results = [result]
    return result
  },
})

registerVirtualCommand({
  name: 'cat',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'cat'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const target = unquote(c.command[1])
    const stdout = await pMap(Object.keys(c.files).filter(f => Minimatch(f, target)), f => readFileAsText(c.files[f]))
    const result: ExecuteResult = {
      stderr: target.includes('*') ? [] : stdout.length ? [] : [target + ' not found.'],
      results: [], commands: [c.command],
      stdout,
      exitCode: target.includes('*') ? 0 : stdout.length > 0 ? 0 : 1,
      outputFiles: [], command: c.command, inputFiles: values(c.files),
    }
    result.results = [result]
    return result
  },
})

registerVirtualCommand({
  name: 'substitution',
  predicate(c: VirtualCommandContext): boolean {
    return !!resolveCommandSubstitution(c.command).substitution
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const { fixedCommand, substitution } = resolveCommandSubstitution(c.command)
    const files = values(c.files)
    const result = await execute({ inputFiles: files, commands: [substitution.command] })
    if (result.stdout.length) {

      result.stdout[result.stdout.length - 1] = result.stdout[result.stdout.length - 1] + substitution.rest
    }
    fixedCommand.splice(substitution.index, 0, result.stdout.join('\n'))
    const result2 = await execute({ inputFiles: files.concat(await pMap(result.outputFiles, f => asInputFile(f))), commands: [fixedCommand] })
    return {
      ...result2, results: [result, result2], stdout: result.stdout.concat(result2.stdout),
      stderr: result.stderr.concat(result2.stderr), commands: [c.command],
      exitCode: result.exitCode || result2.exitCode, outputFiles: result.outputFiles.concat(result2.outputFiles),
    }
  },
})

function resolveCommandSubstitution(command: string[]): { fixedCommand: string[], substitution: { index: number, command: string[], rest: string } } {
  const indexes = command.map((c, i) => c.startsWith('`') || c.endsWith('`') ? i : undefined).filter(c => typeof c !== 'undefined')
  if (!indexes.length) {
    return { fixedCommand: command, substitution: undefined }
  }
  if (indexes.length === 1) {
    indexes.push(indexes[0])
  }
  let rest = ''
  let substitution = command.slice(indexes[0], indexes[1] + 1).map(c => (c.startsWith('`') && c.endsWith('`')) ? c.substring(1, c.length - 1) : (c.lastIndexOf('`') === 0) ? c.substring(1, c.length) : (c.indexOf('`') === c.length - 1) ? c.substring(0, c.length - 1) : c.includes('`') ? (rest = c.substring(c.lastIndexOf('`'), c.length), c.substring(0, c.lastIndexOf('`'))) : c)
  substitution = substitution.map(c => c.replace(/`/g, ''))
  rest = rest.replace(/`/g, '')
  const fixedCommand = command.map(s => s)
  fixedCommand.splice(indexes[0], indexes[1] + 1 - indexes[0])
  return { fixedCommand, substitution: { index: indexes[0], command: substitution, rest } }
}

registerVirtualCommand({
  name: 'get image',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'buildInputFile'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const outputFiles: MagickOutputFile[] = []
    const stderr = []
    try {
      outputFiles.push(await asOutputFile(await buildInputFile(c.command[1], c.command[2] || undefined)))
    } catch (error) {
      stderr.push(error.errorMessage || error + '')
    }
    const result: ExecuteResult = {
      outputFiles,
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr, stdout: outputFiles.length ? [unquote(outputFiles[0].name)] : [],
      inputFiles: values(c.files), results: [],
    }
    return { ...result, results: [result] }

  },
})

let uniqueNameCounter = 0
registerVirtualCommand({
  name: 'uniqueName',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'uniqueName'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    return newExecuteResult(c, { stdout: ['unique_' + (uniqueNameCounter++)] })
  },
})

function newExecuteResult(c: VirtualCommandContext, result: Partial<ExecuteResult> = {}): ExecuteResult {
  const r: ExecuteResult = {
    ...{
      outputFiles: [],
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr: [], stdout: [],
      inputFiles: values(c.files), results: [],
    }, ...result
  }
  return { ...r, results: [r] }
}

// registerVirtualCommand({
//   name: 'variable declaration',
//   predicate(config: VirtualCommandContext): boolean {
//     return !!config.command.find(c => {
//       const decl = !!c.match(/^\s*([A-Za-z0-9]+)=(.+)$/)
//       // variableDeclarations[config.executionId] = variableDeclarations[config.executionId] || {}
//       if (decl) {
//         return true//variableDeclarations[config.executionId] && variableDeclarations[config.executionId][decl[1]]
//       }
//       else {
//         return variableDeclarations[config.executionId] && !!Object.keys(variableDeclarations[config.executionId]).find(varName => !!new RegExp(`[^\\]$${varName}=`).exec(c))
//       }
//     })
//   },
//   async execute(config: VirtualCommandContext): Promise<ExecuteResult> {
//     const decl = config.command.join(' ').match(/^\s*([A-Za-z0-9]+)=(.+)$/)
//     if (decl) {
//       variableDeclarations[config.executionId] = variableDeclarations[config.executionId] || {}
//       variableDeclarations[config.executionId][decl[1]] = decl[2]
//       return newExecuteResult(config)
//     }
//     // TODO: support variable inside substitution
//     let varNameMatch
//     const newCommand = config.command.map(c => {
//       const varNameMatch = Object.keys(variableDeclarations[config.executionId]).find(varName=>!!c.match(new RegExp(`[^\\]$${varName}`)))
//       return c.replace(new RegExp(`[^\\]$${varNameMatch}`, 'g'), variableDeclarations[config.executionId][varNameMatch])
//     })
//     if(varNameMatch){
//       const result = await execute({inputFiles: values(config.files),commands: [newCommand]} )
//       return newExecuteResult(config, result)
//     }
//   },
// })

// const variableDeclarations: { [key: number]: { [varName: string]: string } } = {}
