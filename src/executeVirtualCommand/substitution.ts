import pMap from 'p-map'
import { asInputFile, execute, ExecuteResult, values } from '..'
import { VirtualCommand, VirtualCommandContext } from './VirtualCommand'
import { cliToArray, cliToArrayOne } from '../util';

export default {
  name: 'substitution',
  predicate(c: VirtualCommandContext): boolean {
    return !!resolveCommandSubstitution(c.command).substitution
  },
  async execute(config: VirtualCommandContext): Promise<ExecuteResult> {
    const { fixedCommand, substitution } = resolveCommandSubstitution(config.command)
    const files = values(config.files)
    // console.log(c, substitution);
    // debugger
    const result = await execute({ 
      inputFiles: files, 
      commands: [substitution.command],
       executionId: config.executionId 
      })
    if (result.stdout.length) {
      result.stdout[result.stdout.length - 1] = substitution.restStart + result.stdout[result.stdout.length - 1] + substitution.restEnd
    }
    fixedCommand.splice(substitution.index, 0, ...result.stdout)
    const result2 = await execute({ 
      inputFiles: files.concat(await pMap(result.outputFiles, f => asInputFile(f))), 
      commands: [fixedCommand], 
      executionId: config.executionId })
      config.virtualCommandLogs[this.name].push({substitutionCommand: substitution.command, substitutionCommandStdout: result.stdout, fixedCommand})
    return {
      ...result2, 
      results: [result, result2], 
      stdout: result.stdout.concat(result2.stdout),
      stderr: result.stderr.concat(result2.stderr), 
      commands: [config.command],
      exitCode: result.exitCode || result2.exitCode, 
      outputFiles: result.outputFiles.concat(result2.outputFiles),
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
  // debugger
  const substitution = command.slice(indexes[0], indexes[1] + 1)
    .map(c => c.replace(/\'\`/g, '`'))
    .map(c => {
      if (!c.includes(q)) {
        return c
      }
      if (c.indexOf(q) < c.lastIndexOf(q)) { // means it's a single argument command like `foo prefix\`cmd\`postfix`
      // debugger
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
  // debugger
  // const substitutionCommand = Array.isArray(substitution) && substitution.length===1 && substitution[0].includes(' ') ? cliToArrayOne(substitution[0]).map(s=>s+'') : substitution // so it works in the case of substitution for a quoted variable declaration like  size='\`identify -format %wx%h\\n  rose:\`'
  // return { fixedCommand, substitution: { index: indexes[0], command: substitutionCommand, restStart, restEnd } }
  return { fixedCommand, substitution: { index: indexes[0], command: substitution, restStart, restEnd } }
}
