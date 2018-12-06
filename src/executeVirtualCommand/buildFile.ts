import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile } from '../util'
import { VirtualCommandContext, VirtualCommand } from './VirtualCommand'

export default {
  name: 'buildFile',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'buildFile'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    let outputFile: MagickOutputFile
    const stderr = []
    try {
      outputFile = {...await asOutputFile(await buildInputFile(c.command[1], c.command[2] || undefined)), ignore: true}
    } catch (error) {
      stderr.push(error.errorMessage || error + '')
    }
    const result: ExecuteResult = {
      outputFiles: outputFile ? [outputFile]: [],
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr,
      stdout: outputFile ? [unquote(outputFile.name)] : [],
      inputFiles: values(c.files),
      results: [],
    }
    return { ...result, results: [result] }
  },
} as VirtualCommand
