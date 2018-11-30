import { execute, ExecuteResult, values } from '..'
import { VirtualCommand, VirtualCommandContext, _newExecuteResult } from './VirtualCommand'

export default {
  name: 'variable declaration',
  predicate(config: VirtualCommandContext): boolean {
    return !!config.command.find(c => {
      const decl = !!c.match(/^\s*([A-Za-z0-9]+)=(.+)$/)
      if (decl) {
        return true
      }
      else {
        return variableDeclarations[config.executionId] && !!Object.keys(variableDeclarations[config.executionId]).find(varName => c.includes(`$${varName}`))
      }
    })
  },
  async execute(config: VirtualCommandContext): Promise<ExecuteResult> {
    const decl = config.command.join(' ').match(/^\s*([A-Za-z0-9]+)(=.+)$/)
    if (decl) {
      const variableName = decl[1]
      const variableValue = decl[2].replace('=\'', '')
      variableDeclarations[config.executionId] = variableDeclarations[config.executionId] || {}
      variableDeclarations[config.executionId][variableName] = variableValue
      return _newExecuteResult(config)
    }
    // TODO: support variable inside substitution
    let varNameMatch
    const newCommand = config.command.map(c => {
      varNameMatch = Object.keys(variableDeclarations[config.executionId]).find(varName => c.includes(`$${varName}`))
      if (varNameMatch) {
        return c.replace(`$${varNameMatch}`, variableDeclarations[config.executionId][varNameMatch])
      }
      return c
    })
    const result = await execute({ inputFiles: values(config.files), commands: [newCommand] })
    return _newExecuteResult(config, result)
  },
} as VirtualCommand

const variableDeclarations: { [key: number]: { [varName: string]: string } } = {}
