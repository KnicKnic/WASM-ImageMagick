import { ExecuteResult } from '..'
import { VirtualCommand, VirtualCommandContext, _newExecuteResult } from './VirtualCommand'

export default {
  name: 'variableDeclaration',
  predicate(config: VirtualCommandContext): boolean {
    return !!config.command.find(c => {
      const decl = !!c.match(/^\s*([A-Za-z0-9]+)=(.+)$/)
      if (decl) {
        return true
      }
    })
  },
  async execute(config: VirtualCommandContext): Promise<ExecuteResult> {
    const decl = config.command.join(' ').match(/^\s*([A-Za-z0-9]+)=(.+)$/)
    if (decl) {
      const variableName = decl[1]
      const variableValue = decl[2].replace('\'', '')
      _variableDeclarations[config.executionId] = _variableDeclarations[config.executionId] || {}
      _variableDeclarations[config.executionId][variableName] = variableValue
      config.virtualCommandLogs[this.name].push({ name: variableName, value: variableValue })
      return _newExecuteResult(config)
    }
  },
} as VirtualCommand

export const _variableDeclarations: { [key: number]: { [varName: string]: string } } = {}
