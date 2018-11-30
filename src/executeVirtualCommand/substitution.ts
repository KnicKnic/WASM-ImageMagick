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

      result.stdout[result.stdout.length - 1] = substitution.restStart + result.stdout[result.stdout.length - 1] + substitution.restEnd
    }
    fixedCommand.splice(substitution.index, 0, result.stdout.join('\n'))
    const result2 = await execute({ inputFiles: files.concat(await pMap(result.outputFiles, f => asInputFile(f))), commands: [fixedCommand], executionId: c.executionId })
    return {
      ...result2, results: [result, result2], stdout: result.stdout.concat(result2.stdout),
      stderr: result.stderr.concat(result2.stderr), commands: [c.command],
      exitCode: result.exitCode || result2.exitCode, outputFiles: result.outputFiles.concat(result2.outputFiles),
    }
  },
} as VirtualCommand

export function resolveCommandSubstitution(command: string[]): { fixedCommand: string[], substitution: { index: number, command: string[], restEnd: string, restStart: string } } {
  const q = '`'
  const indexes = command.map((c, i) => /* c.startsWith(q) || c.endsWith(q) */ c.includes(q) ? i : undefined).filter(c => typeof c !== 'undefined')
  if (!indexes.length) {
    return { fixedCommand: command, substitution: undefined }
  }
  if (indexes.length === 1) { // means it's a single argument command
    indexes.push(indexes[0])
  }
  let restStart = undefined
  let restEnd = undefined
  const substitution = command.slice(indexes[0], indexes[1] + 1)
    .map(c => c.replace(/\'\`/g, '`'))
    .map(c => {
      if (!c.includes(q)) {
        return c
      }
      if (c.indexOf(q) < c.lastIndexOf(q)) { // means it's a single argument command like `foo prefix\`cmd\`postfix`
        restStart = c.substring(0, c.indexOf(q)).replace(/`/g, '')
        restEnd = c.substring(c.lastIndexOf(q), c.length).replace(/`/g, '')
        return c.substring(c.indexOf(q) + 1, c.lastIndexOf(q)).replace(/`/g, '')
      }
      if (restStart === undefined) {
        restStart = c.substring(0, c.indexOf(q)).replace(/`/g, '')
        return c.substring(c.indexOf(q), c.length).replace(/`/g, '')
      }
      else {
        restEnd = c.substring(c.indexOf(q), c.length).replace(/`/g, '')
        return c.substring(0, c.indexOf(q)).replace(/`/g, '')
      }
    })
  const fixedCommand = command.map(s => s)
  fixedCommand.splice(indexes[0], indexes[1] + 1 - indexes[0])
  return { fixedCommand, substitution: { index: indexes[0], command: substitution, restStart, restEnd } }
}
