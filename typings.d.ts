export interface MagickFile {
  name: string
}

export interface MagickOutputFile extends MagickFile {
  blob: Blob
}

export interface MagickInputFile extends MagickFile {
  /** content of the input file. This is declared as optional so higher level APIs can extend this interface but it must be initialized in order to execute convert */
  content?: Uint8Array
}

export declare function Call(files: MagickInputFile[], command: string[]): Promise<MagickOutputFile[]>
