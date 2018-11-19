import pMap from 'p-map'
import { loadImageElement, MagickFile, asOutputFile } from '../src'

export async function showImages(images: MagickFile[]): Promise<void> {
  await pMap(images, async image => {
    const el = document.createElement('img')
    el.title = el.alt = image.name
    
    document.body.appendChild(el)
    return await loadImageElement(image, el)
  }, {concurrency: 1})
}


export async function showDownloadLink(images: MagickFile[]): Promise<void> {
  await pMap(images, async image => {
    const el = document.createElement('a')
    const o = await asOutputFile(image)
    el.href = URL.createObjectURL(o.blob)
    el.target='_blank'
    el.innerHTML=el.download =image.name
    document.body.appendChild(el)
    return Promise.resolve()
  }, {concurrency: 1})
}
