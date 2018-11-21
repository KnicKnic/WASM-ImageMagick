import { Command, ExecuteResult, ExecuteConfig, execute, executeOne } from './execute'
import { MagickInputFile } from './magickApi'
import { asOutputFile, readFileAsText, asCommand, values } from './util'
import pMap from 'p-map'

export interface VirtualCommandContext {
  command: string[]
  files: { [name: string]: MagickInputFile }
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
      stdout: file ? [file.name] : [], errors: file ? [] : [`${c.command[1]} file not found`],
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
      stderr: file ? [] : [`${c.command[1]} file not found`], results: [], commands: [c.command],
      stdout: file ? [await readFileAsText(file)] : [],
      errors: file ? [] : [`${c.command[1]} file not found`],
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
    const result2 = await execute({ inputFiles: files.concat(result.inputFiles), commands: [fixedCommand] })
    return {
      ...result2, results: [result, result2], stdout: result.stdout.concat(result2.stdout), stderr: result.stderr.concat(result2.stderr), commands: [c.command], exitCode: result.exitCode || result2.exitCode,
    }
  },
})

export function resolveCommandSubstitution(command: string[]): { fixedCommand: string[], substitution: { index: number, command: string[] } } {
  const indexes = command.map((c, i) => c.startsWith('`') || c.endsWith('`') ? i : undefined).filter(c => typeof c !== 'undefined')
  if (!indexes.length) {
    return { fixedCommand: command, substitution: undefined }
  }
  const substitution = command.slice(indexes[0], indexes[1] + 1).map(c => c.startsWith('`') ? c.substring(1, c.length) : c.endsWith('`') ? c.substring(0, c.length - 1) : c)
  const fixedCommand = command.map(s => s)
  fixedCommand.splice(indexes[0], indexes[1] + 1 - indexes[0])
  return { fixedCommand, substitution: { index: indexes[0], command: substitution } }
}
