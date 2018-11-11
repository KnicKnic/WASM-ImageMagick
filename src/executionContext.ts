import { ImageHome } from '.'
import { ExecuteConfig, ExecuteResult, execute, ExecuteCommand } from './execute'
import { createImageHome } from './imageHome'
import { MagickInputFile, MagickFile } from './magickApi'
import fileSpec from '../spec/util/fileSpec'

/**
 * Allow multiple execute() calls remembering previus execute() generated output files and previous given input files that can be used as input files in next calls.
 */
export class ExecutionContext {
  private imageHome: ImageHome
  constructor() {
    this.imageHome = createImageHome()
  }
  async execute(configOrCommands: ExecuteConfig|ExecuteCommand|string): Promise<ExecuteResult> {
    const config = asConfig(configOrCommands)
    config.inputFiles.forEach(f => {
      this.imageHome.register(f)
    })
    const inputFiles = await this.imageHome.getAll()
    const result = await execute({...config, inputFiles})
    result.outputFiles.forEach(f => {
      this.imageHome.register(f)
    })
    return result
  }
  addFiles(files: MagickFile[]) {
    files.forEach(f => this.imageHome.register(f))
  }
  async getAllFiles(): Promise<MagickInputFile[]> {
    return this.imageHome.getAll()
  }
}

function asConfig(configOrCommands: ExecuteConfig|ExecuteCommand|string): ExecuteConfig {
  if (typeof configOrCommands === 'string') {
    return {inputFiles: [], commands: [configOrCommands]}
  }
  return (configOrCommands as ExecuteConfig).inputFiles ? (configOrCommands as ExecuteConfig) :
  ({commands: configOrCommands as ExecuteCommand, inputFiles: ([] as MagickInputFile[])} as ExecuteConfig)
}
