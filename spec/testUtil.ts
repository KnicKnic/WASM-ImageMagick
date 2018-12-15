import pMap from 'p-map'
import { loadImageElement, MagickFile, asOutputFile, execute, asInputFile } from '../src'

export async function showImages(images: MagickFile[]|MagickFile): Promise<HTMLImageElement[]> {
  images = Array.isArray(images) ? images : [images]
  return await pMap(images, async image => {
    const r = await execute({inputFiles: [await asInputFile(image)], commands: `convert ${image.name} out.png`})
    const compatible = r.outputFiles.find(f=>f.name==='out.png')
    const el = document.createElement('img')
    el.title = el.alt = image.name
    document.body.appendChild(el)
    return loadImageElement(compatible, el)
  }, {concurrency: 1})
}

export async function showDownloadLink(images: MagickFile[]): Promise<void> {
  await pMap(images, async image => {
    const el = document.createElement('a')
    const o = await asOutputFile(image)
    el.href = URL.createObjectURL(o.blob)
    el.target = '_blank'
    el.innerHTML = el.download = image.name
    document.body.appendChild(el)
    return Promise.resolve()
  }, {concurrency: 1})
}

export function absolutize(s) {
  return `${window.location.protocol}//${window.location.host}/${s}`
}
