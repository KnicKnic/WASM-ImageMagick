import { createImageHome, execute, ExecuteCommand, ExecuteConfig, ExecuteResult, ImageHome, MagickFile, MagickInputFile } from '.'
import { getBuiltInImages } from './util'

/**
 * Allow multiple execute() calls remembering previus execute() generated output files and previous given input files that
 * can be used as input files in next calls.
 */
export interface ExecutionContext {
  execute(configOrCommands: ExecuteConfig|ExecuteCommand|string): Promise<ExecuteResult>
  /** programmatically add new files so they are available if following execute() calls */
  addFiles(files: MagickFile[]): void
  /** get all the files currently available in this context */
  getAllFiles(): Promise<MagickInputFile[]>
  // /** add built-in images like `rose:` to this execution context so they are present in getAllFiles() */
  addBuiltInImages(): Promise<void>
  getFile(name: string): Promise<MagickInputFile>
  removeFiles(names: string[]): MagickInputFile[]
}

class ExecutionContextImpl implements ExecutionContext {

  constructor(private imageHome: ImageHome = createImageHome()) {
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
    return await this.imageHome.getAll()
  }

  async getFile(name: string): Promise<MagickInputFile> {
    return await this.imageHome.get(name)
  }

  async addBuiltInImages() {
    return this.imageHome.addBuiltInImages()
  }

  removeFiles(names: string[]): MagickInputFile[] {
    return this.imageHome.remove(names)
  }
  
  static create(inheritFrom?: ExecutionContext) {
    if (inheritFrom && !(inheritFrom as ExecutionContextImpl).imageHome) {
      throw new Error('Dont know how to inherit from other ExecutionContext implementation than this one')
    }
    return new ExecutionContextImpl(inheritFrom && (inheritFrom as ExecutionContextImpl).imageHome)
  }

}

function asConfig(configOrCommands: ExecuteConfig|ExecuteCommand|string): ExecuteConfig {
  if (typeof configOrCommands === 'string') {
    return {inputFiles: [], commands: [configOrCommands]}
  }
  return (configOrCommands as ExecuteConfig).inputFiles ? (configOrCommands as ExecuteConfig) :
  ({commands: configOrCommands as ExecuteCommand, inputFiles: ([] as MagickInputFile[])} as ExecuteConfig)
}

export function newExecutionContext(inheritFrom?: ExecutionContext): ExecutionContext {
  return ExecutionContextImpl.create(inheritFrom)
}
