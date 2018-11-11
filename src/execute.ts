import { MagickInputFile, MagickOutputFile } from './index';
import { Call } from './magickApi';

export type Command = (string|number)[]

export interface ExecuteConfig {
  inputFiles: MagickInputFile[]
  commands: Command[]
}
export interface ExecuteResult {
  outputFiles: MagickOutputFile[]
}

/** execute first commad in given config */
export async function executeOne(config: ExecuteConfig): Promise<ExecuteResult> {
  const command = config.commands[0]
  let t0 = performance.now()
  executeListeners.forEach(listener => listener.beforeExecute({ command , took: performance.now() - t0, id: t0 }))
  const result = { outputFiles: await Call(config.inputFiles, command.map(c=>c+'')) }
  executeListeners.forEach(listener => listener.afterExecute({ command , took: performance.now() - t0, id: t0 }))
  // console.log('Executed: ' + JSON.stringify(command), 'Output files: ', result.outputFiles.map(f => f.name));
  return result
}
// execute event emitter

export interface ExecuteEvent {
  command: Command
  took: number
  id: number
}
export interface ExecuteListener {
  afterExecute?(event: ExecuteEvent): void
  beforeExecute?(event: ExecuteEvent): void
}
let executeListeners: ExecuteListener[] = []
export function addExecuteListener(l: ExecuteListener) {
  executeListeners.push(l)
}


// /**
//  * Execute all commands in given config serially in order. Output files from a command become available as input files in next commands. The execution result will contain all generated outputFiles. If same file name is used later command output files will override previous ones. Example:
//  * 
//  * ```ts
//  * const result = await execute({
//  *  inputFiles: [image1],
//  *  commands: [
//  *    ['convert', 'image1.png', "-bordercolor", "#ffee44", "-background", "#eeff55", "+polaroid", "image2.png"], 
//  *    // heads up: next command uses "image2.png" which was the output of previous command:
//  *    ["convert", "image2.png", "-fill", "#997711", "-tint", "55"],
//  *  ]
//  * })
//  * ```
//  */

// import pMap from 'p-map'
// // async function forEachSerial(arr: any[], f: (n: any)=>Promise<any>){
// //   await pMap(arr, async n=>{
// //     await f(n)
// //   }, {concurrency: 1})
// // }
// import { outputFileToInputFile } from './image';
// export async function execute(config: ExecuteConfig): Promise<ExecuteResult> {
//   const allOutputFiles: {[name: string]: MagickOutputFile} = {}
//   const allInputFiles : {[name: string]: MagickInputFile} = {}
//   config.inputFiles.forEach(f=>{
//     allInputFiles[f.name] = f
//   })
//   async function mapper(c: Command){
//     const thisConfig = {
//       inputFiles: Object.keys(allInputFiles).map(name=>allInputFiles[name]), 
//       commands: [c]
//     }
//     const result = await executeOne(thisConfig)
//     await pMap(result.outputFiles, async f=>{
//       allOutputFiles[f.name] = f    
//       const inputFile = await outputFileToInputFile(f)
//       allInputFiles[inputFile.name] = inputFile 
//     })
//   }
//   await pMap(config.commands, mapper, {concurrency: 1})
//   return {
//     outputFiles: Object.keys(allOutputFiles).map(name=>allOutputFiles[name])
//   }
// }