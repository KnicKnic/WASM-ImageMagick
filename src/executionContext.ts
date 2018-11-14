import { ImageHome, ExecuteConfig, ExecuteResult, execute, ExecuteCommand, createImageHome, MagickInputFile, MagickFile, extractInfo } from '.'
import pMap from 'p-map';

/**
 * Allow multiple execute() calls remembering previus execute() generated output files and previous given input files that can be used as input files in next calls.
 */
export interface ExecutionContext {
  execute(configOrCommands: ExecuteConfig|ExecuteCommand|string): Promise<ExecuteResult>
  addFiles(files: MagickFile[]): void
  getAllFiles(): Promise<MagickInputFile[]>
}

export function newExecutionContext(inheritFrom?: ExecutionContext): ExecutionContext {
  return ExecutionContextImpl.create(inheritFrom)
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
    return this.imageHome.getAll()
  }
  async addBuiltInImages() {
    const builtInImages = ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']
    
    pMap(builtInImages, async name=>{
      const info = extractInfo(name)
      // const {outputFiles} = 
    })
  }
  static create(inheritFrom?: ExecutionContext) {
    if (inheritFrom && !(inheritFrom as ExecutionContextImpl).imageHome) {
      throw new Error('Dont know how to inherith from other ExecutionContext implementation than this one')
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
