import { ExecuteConfig } from './execute'
const template = require('lodash.template')

export interface CommandPreprocessor {
  name: string,
  execute: (context: ExecuteConfig) => ExecuteConfig
}

const commandPreprocessors: CommandPreprocessor[] = []

/** internal - executes all registered preprocessors on given config */
export function _preprocessCommand(config: ExecuteConfig): ExecuteConfig {

  let cfg = config
  commandPreprocessors.forEach(p => {
    cfg = p.execute(cfg)
  })
  return { ...cfg }

}

export function registerCommandPreprocessor(p: CommandPreprocessor) {
  commandPreprocessors.push(p)
}

registerCommandPreprocessor({
  name: 'template',
  execute(context) {
    if (typeof (context.commands) === 'string') {
      const commandTemplate = template(context.commands)
      const commands = commandTemplate(context)
      return { ...context, commands }
    }
    else {
      return context
    }
  },
})
