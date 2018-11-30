import { ExecuteResult, values } from '..'
import { VirtualCommandContext, newExecuteResult, VirtualCommand } from './VirtualCommand'

export default {
  name: 'uniqueName',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'uniqueName'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    return newExecuteResult(c, { stdout: ['unique_' + (uniqueNameCounter++)] })
  },
} as VirtualCommand

let uniqueNameCounter = 0
