import pMap from 'p-map'
import { asInputFile, execute, ExecuteResult, values } from '..'
import { VirtualCommand, VirtualCommandContext } from './VirtualCommand'

export default {
  name: 'substitution',
  predicate(c: VirtualCommandContext): boolean {
    return !!resolveCommandSubstitution(c.command).substitution
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const { fixedCommand, substitution } = resolveCommandSubstitution(c.command)
    const files = values(c.files)
    const result = await execute({ inputFiles: files, commands: [substitution.command], executionId: c.executionId })
    if (result.stdout.length) {

      result.stdout[result.stdout.length - 1] = result.stdout[result.stdout.length - 1] + substitution.rest
    }
    fixedCommand.splice(substitution.index, 0, result.stdout.join('\n'))
    const result2 = await execute({ inputFiles: files.concat(await pMap(result.outputFiles, f => asInputFile(f))), commands: [fixedCommand] , executionId: c.executionId})
    return {
      ...result2, results: [result, result2], stdout: result.stdout.concat(result2.stdout),
      stderr: result.stderr.concat(result2.stderr), commands: [c.command],
      exitCode: result.exitCode || result2.exitCode, outputFiles: result.outputFiles.concat(result2.outputFiles),
    }
  },
} as VirtualCommand

function resolveCommandSubstitution(command: string[]): { fixedCommand: string[], substitution: { index: number, command: string[], rest: string } } {
  const indexes = command.map((c, i) => c.startsWith('`') || c.endsWith('`') ? i : undefined).filter(c => typeof c !== 'undefined')
  if (!indexes.length) {
    return { fixedCommand: command, substitution: undefined }
  }
  if (indexes.length === 1) {
    indexes.push(indexes[0])
  }
  let rest = ''
  let substitution = command.slice(indexes[0], indexes[1] + 1).map(c =>
    (c.startsWith('`') && c.endsWith('`')) ? c.substring(1, c.length - 1) : (c.lastIndexOf('`') === 0) ?
    c.substring(1, c.length) : (c.indexOf('`') === c.length - 1) ?
    c.substring(0, c.length - 1) : c.includes('`') ?
    (rest = c.substring(c.lastIndexOf('`'), c.length), c.substring(0, c.lastIndexOf('`'))) : c,
  )
  substitution = substitution.map(c => c.replace(/`/g, ''))
  rest = rest.replace(/`/g, '')
  const fixedCommand = command.map(s => s)
  fixedCommand.splice(indexes[0], indexes[1] + 1 - indexes[0])
  return { fixedCommand, substitution: { index: indexes[0], command: substitution, rest } }
}
