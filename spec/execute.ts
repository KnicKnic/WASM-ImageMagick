// import * as Magick from 'wasm-imagemagick'
// // import * as promiseMap from 'p-map'
// import {  MagickInputFile, MagickOutputFile } from  'wasm-imagemagick'
// // import { outputFileToInputFile } from './util/image';

// export type Command = string[]

// export interface ExecuteConfig {
//   inputFiles: MagickInputFile[]
//   /** commands to execute, serially */
//   commands: Command[]
// }
// export interface ExecuteResult {
//   outputFiles: MagickOutputFile[]
// }


// // export async function execute(config: ExecuteConfig): Promise<ExecuteResult[]> {
// //   const files: MagickInputFile[] = [] // files generated in between commands are stored and provided by IM on each call to eecuteOne
// //   async function executor(command: Command): Promise<ExecuteResult> {
// //     config.inputFiles = config.inputFiles.concat(files) // TODO: review config.command vs config.commands and and remove duplicated
// //     const result = await executeOne(config)
// //     const inputFiles = await Promise.all(result.outputFiles.map(outputFileToInputFile))
// //     inputFiles.forEach(file => {
// //       files.push(file) // TODO: replace content if it already exists
// //     })
// //     return result
// //   }
// //   return await promiseMap(config.commands, command => executor(command), { concurrency: 1 })
// // }

// export async function executeOne(config: ExecuteConfig): Promise<ExecuteResult> {
//   const command = config.commands[0]
//   let t0 = performance.now()
//   executeListeners.forEach(listener => listener.beforeExecute({ command, took: performance.now() - t0, id: t0 }))
//   const result = { outputFiles: await Magick.Call(config.inputFiles, command) }
//   executeListeners.forEach(listener => listener.afterExecute({ command, took: performance.now() - t0, id: t0 }))
//   // console.log('Executed: ' + JSON.stringify(command), 'Output files: ', result.outputFiles.map(f => f.name));
//   return result
// }


// // execute event emitter

// export interface ExecuteEvent {
//   command: Command
//   took: number
//   id: number
// }
// export interface ExecuteListener {
//   afterExecute?(event: ExecuteEvent): void
//   beforeExecute?(event: ExecuteEvent): void
// }
// let executeListeners: ExecuteListener[] = []
// export function addExecuteListener(l: ExecuteListener) {
//   executeListeners.push(l)
// }