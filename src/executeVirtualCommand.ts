import pMap from 'p-map'
import { execute, ExecuteResult } from './execute'
import { MagickInputFile, MagickOutputFile } from './magickApi'
import { asInputFile, asOutputFile, buildInputFile, readFileAsText, unquote, values } from './util'

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
    const file = c.files[c.command[1]]
    const result: ExecuteResult = {
      stderr: file ? [] : [`${c.command[1]} file not found`],
      stdout: file ? [file.name] : [],
      exitCode: file ? 0 : 1, outputFiles: [], command: c.command, commands: [c.command], inputFiles: values(c.files), results: [],
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
    const file = c.files[c.command[1]]
    const result: ExecuteResult = {
      stderr: file ? [] : [`${c.command[1]} file not found`],
      results: [], commands: [c.command],
      stdout: file ? [await readFileAsText(file)] : [],
      exitCode: file ? 0 : 1,
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
    fixedCommand.splice(substitution.index, 0, result.stdout.join('\n'))
    const result2 = await execute({ inputFiles: files.concat(await pMap(result.outputFiles, f => asInputFile(f))), commands: [fixedCommand] })
    return {
      ...result2, results: [result, result2], stdout: result.stdout.concat(result2.stdout),
      stderr: result.stderr.concat(result2.stderr), commands: [c.command],
      exitCode: result.exitCode || result2.exitCode, outputFiles: result.outputFiles.concat(result2.outputFiles),
    }
  },
})

function resolveCommandSubstitution(command: string[]): { fixedCommand: string[], substitution: { index: number, command: string[] } } {
  const indexes = command.map((c, i) => c.startsWith('`') || c.endsWith('`') ? i : undefined).filter(c => typeof c !== 'undefined')
  if (!indexes.length) {
    return { fixedCommand: command, substitution: undefined }
  }
  const substitution = command.slice(indexes[0], indexes[1] + 1).map(c => c.startsWith('`') ? c.substring(1, c.length) : c.endsWith('`') ? c.substring(0, c.length - 1) : c)
  const fixedCommand = command.map(s => s)
  fixedCommand.splice(indexes[0], indexes[1] + 1 - indexes[0])
  return { fixedCommand, substitution: { index: indexes[0], command: substitution } }
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
//         return variableDeclarations[config.executionId] && !!Object.keys(variableDeclarations[config.executionId]).find(varName => c.includes('$' + varName))
//       }
//     })
//   },
//   async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
//     return !!config.command.find(c => {
//       const decl = !!c.match(/^\s*([A-Za-z0-9]+)=(.+)$/)
//       if (decl) {
//         variableDeclarations[config.executionId] = variableDeclarations[config.executionId] || {}
//         variableDeclarations[config.executionId][decl[1]] = decl[2]
//         return {}
//       }
//       else {
//         return !!Object.keys(variableDeclarations[config.executionId]).find(varName => c.includes('$' + varName))
//       }
//     })
//   },
// })

// const variableDeclarations: { [key: number]: { [varName: string]: string } } = {}
