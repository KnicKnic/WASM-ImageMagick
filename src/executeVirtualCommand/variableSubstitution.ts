import { execute, ExecuteResult, values } from '..'
import { VirtualCommand, VirtualCommandContext, _newExecuteResult } from './VirtualCommand'
import { _variableDeclarations } from './variableDeclaration';

export default {
  name: 'variable substitution',
  predicate(config: VirtualCommandContext): boolean {
    return !!config.command.find(c => {
      return _variableDeclarations[config.executionId] && !!Object.keys(_variableDeclarations[config.executionId]).find(varName => c.includes(`$${varName}`))
    })
  },
  async execute(config: VirtualCommandContext): Promise<ExecuteResult> {
    let varNameMatch
    const newCommand = config.command.map(c => {
      varNameMatch = Object.keys(_variableDeclarations[config.executionId]).find(varName => c.includes(`$${varName}`))
      if (varNameMatch) {
        config.virtualCommandLogs[this.name].push({ 
          name: varNameMatch, 
          value: _variableDeclarations[config.executionId][varNameMatch], 
          command: c 
        })
        return c.replace(`$${varNameMatch}`, _variableDeclarations[config.executionId][varNameMatch])
      }
      return c
    })
    const result = await execute({ inputFiles: values(config.files), commands: [newCommand] })
    return _newExecuteResult(config, result)
  },
} as VirtualCommand
