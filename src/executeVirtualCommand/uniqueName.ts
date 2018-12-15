import { ExecuteResult, values } from '..'
import { VirtualCommandContext, _newExecuteResult, VirtualCommand } from './VirtualCommand'

export default {
  name: 'uniqueName',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'uniqueName'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    return _newExecuteResult(c, { stdout: [getUniqueIdentifier()] })
  },
} as VirtualCommand

export function getUniqueIdentifier(){
  return 'unique_' + (uniqueNameCounter++)
}
let uniqueNameCounter = 0
