import pMap from 'p-map'
import { ExecuteResult, readFileAsText, unquote, values } from '..'
import { VirtualCommandContext, VirtualCommand } from './VirtualCommand'
const Minimatch = require('minimatch')

export default {
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
} as VirtualCommand
