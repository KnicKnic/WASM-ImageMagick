import { ImageHome, ExecuteConfig, ExecuteResult, execute, ExecuteCommand, createImageHome, MagickInputFile, MagickFile, extractInfo } from '.'
import pMap from 'p-map'
import { asOutputFile, asInputFile, getBuiltInImages } from './util'

/**
 * Allow multiple execute() calls remembering previus execute() generated output files and previous given input files that can be used as input files in next calls.
 */
export interface ExecutionContext {
  execute(configOrCommands: ExecuteConfig|ExecuteCommand|string): Promise<ExecuteResult>
  addFiles(files: MagickFile[]): void
  getAllFiles(): Promise<MagickInputFile[]>
  addBuiltInImages(): Promise<MagickFile[]>
  getFile(name: string): Promise<MagickInputFile>
}

class ExecutionContextImpl implements ExecutionContext {

  private builtInImages: MagickInputFile[] = []

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
    const all = await this.imageHome.getAll()
    return all.concat(this.builtInImages)
  }

  async getFile(name: string): Promise<MagickInputFile> {
    return (await this.imageHome.get(name)) || this.builtInImages.find(i => i.name === name)
  }

  async addBuiltInImages() {
    if (!this.builtInImages.length) {
      this.builtInImages = await getBuiltInImages()
  //     const builtInImages = ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']
  //     this.builtInImages = await pMap(builtInImages, async name=>{
  //       const info = await extractInfo(name)
  //       // const outputName = `output1.${info[0].image.format.toLowerCase()}`
  //       const {outputFiles} = await execute({commands:`convert ${name} ${`output1.${info[0].image.format.toLowerCase()}`}`} )
  //       outputFiles[0].name = name
  //       return await asInputFile(outputFiles[0])
  //     })
    }
    return this.builtInImages
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

export function newExecutionContext(inheritFrom?: ExecutionContext): ExecutionContext {
  return ExecutionContextImpl.create(inheritFrom)
}
