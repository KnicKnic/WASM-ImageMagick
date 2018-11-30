import { ExecuteResult } from '../execute'
import { MagickInputFile } from '../magickApi'
import { values } from '../util'
import buildInputFile from './buildInputFile'
import cat from './cat'
import ls from './ls'
import uniqueName from './uniqueName'
import substitution from './substitution'
import variable from './variable'

export interface VirtualCommand {
  name: string
  execute(c: VirtualCommandContext): Promise<ExecuteResult>
  predicate(c: VirtualCommandContext): boolean
}

export interface VirtualCommandContext {
  command: string[]
  files: { [name: string]: MagickInputFile }
  executionId: number
}

const virtualCommands: VirtualCommand[] = []

export function isVirtualCommand(context: VirtualCommandContext): boolean {
  return !!virtualCommands.find(c => c.predicate(context))
}

export function dispatchVirtualCommand(context: VirtualCommandContext): Promise<ExecuteResult> {
  const cmd = virtualCommands.find(c => c.predicate(context))
  return cmd.execute(context)
}

export function registerVirtualCommand(c: VirtualCommand) {
  virtualCommands.push(c)
}

registerVirtualCommand(variable)

registerVirtualCommand(substitution)

registerVirtualCommand(ls)

registerVirtualCommand(cat)

registerVirtualCommand(buildInputFile)

registerVirtualCommand(uniqueName)

export function _newExecuteResult(c: VirtualCommandContext, result: Partial<ExecuteResult> = {}): ExecuteResult {
  const r: ExecuteResult = {
    ...{
      outputFiles: [],
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr: [], stdout: [],
      inputFiles: values(c.files), results: [],
    }, ...result,
  }
  return { ...r, results: [r] }
}
