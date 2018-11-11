import { MagickInputFile, MagickFile } from '.'
import { asInputFile } from './util/file'

export interface ImageHome {
  get(name: string): Promise<MagickInputFile>
  register(file: MagickFile, name?: string): void
  isRegistered(name: string): boolean
  getAll(): Promise<MagickInputFile[]>
}

type MagickInputFilePromise = Promise<MagickInputFile> & { resolved: true }

class ImageHomeImpl implements ImageHome {

  private images: { [name: string]: MagickInputFilePromise } = {}

  get(name: string): Promise<MagickInputFile> {
    return this.images[name]
  }

  async getAll(): Promise<MagickInputFile[]> {
    return await Promise.all(Object.keys(this.images).map(k => this.images[k]))
  }

  register(file: MagickFile, name: string = file.name): MagickInputFilePromise {
    const promise = asInputFile(file) as MagickInputFilePromise
    this.images[name] = promise
    this.images[name].catch(() => { }).then(() => {
      promise.resolved = true
    })
    return promise
  }

  isRegistered(name: string, andReady: boolean= true): boolean {
    return this.images[name] && (andReady && this.images[name].resolved)
  }
}
export function createImageHome() {return new ImageHomeImpl()}
