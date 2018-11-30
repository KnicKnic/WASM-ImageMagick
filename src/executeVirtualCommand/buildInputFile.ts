import { ExecuteResult, unquote, values } from '..'
import { MagickOutputFile } from '../magickApi'
import { asOutputFile, buildInputFile } from '../util'
import { VirtualCommandContext, VirtualCommand } from './VirtualCommand'

export default {
  name: 'buildInputFile',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'buildInputFile'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    const outputFiles: MagickOutputFile[] = []
    const stderr = []
    try {
      outputFiles.push(await asOutputFile(await buildInputFile(c.command[1], c.command[2] || undefined)))
    } catch (error) {
      stderr.push(error.errorMessage || error + '')
    }
    const result: ExecuteResult = {
      outputFiles,
      commands: [c.command],
      command: c.command,
      exitCode: 0,
      stderr, stdout: outputFiles.length ? [unquote(outputFiles[0].name)] : [],
      inputFiles: values(c.files), results: [],
    }
    return { ...result, results: [result] }
  },
} as VirtualCommand
