import { MagickInputFile } from "./magickApi";

export interface ImageHome {
  get(name: string): Promise<MagickInputFile>
  register(name: string, file: MagickInputFile): void
  isRegistered(name: string): boolean
}

type MagickInputFilePromise = Promise<MagickInputFile> & { resolved: true }

class ImageHomeImpl implements ImageHome {

  private images: { [name: string]: MagickInputFilePromise } = {}

  get(name: string): Promise<MagickInputFile> {
    return this.images[name]
  }

  register(name: string, file: MagickInputFile): MagickInputFilePromise {
    const promise = new Promise(resolve => resolve(file)) as MagickInputFilePromise
    this.images[name] = promise
    this.images[name].catch(() => { }).then(() => { 
      promise.resolved = true 
    })
    return promise
  }

  isRegistered(name: string, andReady: boolean=true): boolean {
    return this.images[name] && (andReady && this.images[name].resolved)
  }
}
export function createImageHome() {return new ImageHomeImpl()}