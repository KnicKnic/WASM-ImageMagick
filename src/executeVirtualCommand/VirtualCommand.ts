import { ExecuteResult, ExecuteConfig, buildExecuteResultWithError } from '../execute'
import { MagickInputFile } from '../magickApi'
import { values } from '../util'
import buildFile from './buildFile'
import cat from './cat'
import ls from './ls'
import uniqueName from './uniqueName'
import substitution from './substitution'
import variableDeclaration from './variableDeclaration'
import variableSubstitution from './variableSubstitution';
import cut from './cut';
import paste from './paste'
import pMap from 'p-map';
import forget from './forget';

export interface VirtualCommand {
  name: string
  execute(c: VirtualCommandContext): Promise<ExecuteResult>
  predicate(c: VirtualCommandContext): boolean
  postProcessResult?(r: ExecuteResult): Promise<ExecuteResult>
  validateCommands?(c: VirtualCommandContext): false|string
}

export type VirtualCommandLogs = { [virtualCommandName: string]: any[] }
export interface VirtualCommandContext {
  command: string[]
  files: { [name: string]: MagickInputFile }
  executionId: number
  virtualCommandLogs: VirtualCommandLogs
}

const virtualCommands: VirtualCommand[] = []

export function isVirtualCommand(context: VirtualCommandContext): boolean {
  return !!virtualCommands.find(c => c.predicate(context))
}
const virtualCommandLogs = {}
export function getVirtualCommandLogsFor(c: ExecuteConfig): VirtualCommandLogs {
  if (!c.executionId) { throw new Error('execution config without executionId') }
  if (!virtualCommandLogs[c.executionId]) {
    virtualCommandLogs[c.executionId] = {}
  }
  return virtualCommandLogs[c.executionId]
  // TODO: probably we can delete all logs from previous executionIds
}
export async function _dispatchVirtualCommand(context: VirtualCommandContext): Promise<ExecuteResult> {
  const cmd = virtualCommands.find(c => c.predicate(context))
  context.virtualCommandLogs[cmd.name] = context.virtualCommandLogs[cmd.name] || []
  if(cmd.validateCommands){
    const error = cmd.validateCommands(context)
    if(error){
      return buildExecuteResultWithError(error)
    }
  }
  return await cmd.execute(context)
}

export async function _dispatchVirtualCommandPostproccessResult(result: ExecuteResult): Promise<ExecuteResult> {
  await pMap(virtualCommands.filter(v => v.postProcessResult), c => {
    result.virtualCommandLogs[c.name] = result.virtualCommandLogs[c.name] || []
    c.postProcessResult(result)
  }, { concurrency: 1 })
  return result
}

export function registerExecuteVirtualCommand(c: VirtualCommand) {
  virtualCommands.push(c)
}

// registerExecuteVirtualCommand(variableSubstitution)
registerExecuteVirtualCommand(substitution)
// registerExecuteVirtualCommand(variableDeclaration)

registerExecuteVirtualCommand(ls)

registerExecuteVirtualCommand(cat)

registerExecuteVirtualCommand(buildFile)

registerExecuteVirtualCommand(uniqueName)
registerExecuteVirtualCommand(cut)
registerExecuteVirtualCommand(paste)
registerExecuteVirtualCommand(forget)

export function _newExecuteResult(c: VirtualCommandContext, result: Partial<ExecuteResult> = {}): ExecuteResult {
  const r: ExecuteResult = {
    ...{
      outputFiles: [],
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr: [], stdout: [],
      inputFiles: values(c.files),
      results: []
    }, ...result,
  }
  const toReturn = { ...r, results: [r] }
  return toReturn
}
