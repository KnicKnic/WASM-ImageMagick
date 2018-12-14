import { ExecuteConfig, execute } from './execute'
import { compare, extractInfo } from './util';
const {render} = require('ejs')


export interface CommandPreprocessor {
  name: string,
  execute: (context: ExecuteConfig) => Promise<ExecuteConfig>
}

const commandPreprocessors: CommandPreprocessor[] = []

/** internal - executes all registered preprocessors on given config */
export async function _preprocessCommand(config: ExecuteConfig): Promise<ExecuteConfig> {
  let cfg = config
  for (let i = 0; i < commandPreprocessors.length; i++) {
    const p = commandPreprocessors[i]
    cfg = await p.execute(cfg)
  }
  // commandPreprocessors.forEach(p => {
  //   cfg = await p.execute(cfg)
  // })
  return cfg
}

export function registerCommandPreprocessor(p: CommandPreprocessor) {
  commandPreprocessors.push(p)
}

registerCommandPreprocessor({
  name: 'template',
  async execute(context) {
    if (typeof (context.commands) === 'string') {
      // const commandTemplate = compile(context.commands, {async: true})
      const commands = await render(context.commands, {...context, execute, compare, extractInfo}, {async: true})
      return { ...context, commands }
    }
    else {
      return context
    }
  },
})
