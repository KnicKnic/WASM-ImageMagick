import * as template from 'lodash.template'
import { ExecuteConfig } from './execute'

export interface CommandPreprocessor {
  name: string,
  execute: (context: ExecuteConfig) => ExecuteConfig
}

const commandPreprocessors: CommandPreprocessor[] = []

/** internal - executes all registered preprocessors on given config */
export function _preprocessCommand(config: ExecuteConfig): ExecuteConfig {
  if (typeof (config.commands) === 'string') {
    let cfg = config
    commandPreprocessors.forEach(p => {
      cfg = p.execute(cfg)
    })
    return { ...cfg }
  }
  else {
    return config
  }
}

export function registerCommandPreprocessor(p: CommandPreprocessor) {
  commandPreprocessors.push(p)
}

registerCommandPreprocessor({
  name: 'template',
  execute(context) {
    const commandTemplate = template(context.commands)
    const commands = commandTemplate(context)
    return { ...context, commands }
  },
})
