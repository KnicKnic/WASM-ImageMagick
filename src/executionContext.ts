import { createImageHome, execute, ExecuteCommand, ExecuteConfig, ExecuteResult, ImageHome, MagickFile, MagickInputFile } from '.'
import { asExecuteConfig } from './execute'

/**
 * Allow multiple execute() calls remembering previous execute() generated output files and previous given input files that
 * can be used as input files in next calls.
 */
export interface ExecutionContext {
  /**
   * This behaves almost the same as [execute()](https://github.com/KnicKnic/WASM-ImageMagick/tree/sample-sinteractive-/apidocs#execute).
   */
  execute(configOrCommands: ExecuteConfig | ExecuteCommand | string): Promise<ExecuteResult>

  /**
   * Programmatically add new files so they are available if following `execute()` calls.
   */
  addFiles(files: MagickFile[]): void

  /**
   * Get all the files currently available in this context.
   */
  getAllFiles(): Promise<MagickInputFile[]>

  /**
   * Add ImageMagick built-in images like `rose:`, `logo:`, etc to this execution context so they are present in `getAllFiles()`.
   */
  addBuiltInImages(): Promise<void>

  /**
   * Get a file by name or undefined if none.
   */
  getFile(name: string): Promise<MagickInputFile|undefined>

  /**
   * Remove files by name.
   * @returns the files actually removed.
   */
  removeFiles(names: string[]): MagickInputFile[]
}

class ExecutionContextImpl implements ExecutionContext {

  constructor(private imageHome: ImageHome = createImageHome()) {
  }

  async execute(configOrCommands: ExecuteConfig | ExecuteCommand | string): Promise<ExecuteResult> {
    const config = asExecuteConfig(configOrCommands)
    config.inputFiles.forEach(f => {
      this.imageHome.register(f)
    })
    const inputFiles = await this.imageHome.getAll()
    const result = await execute({ ...config, inputFiles })
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

export function newExecutionContext(inheritFrom?: ExecutionContext): ExecutionContext {
  return ExecutionContextImpl.create(inheritFrom)
}
