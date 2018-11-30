import { ExecuteResult, unquote, values } from '..'
import { VirtualCommandContext, VirtualCommand } from './VirtualCommand'
const Minimatch = require('minimatch')

export default {
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
}as VirtualCommand
