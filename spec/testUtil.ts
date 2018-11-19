import pMap from 'p-map'
import { loadImageElement, MagickFile } from '../src'

export async function showImages(images: MagickFile[]): Promise<void> {
  await pMap(images, async image => {
    const el = document.createElement('img')
    el.title = image.name
    el.alt = image.name
    document.body.appendChild(el)
    return await loadImageElement(image, el)
  }, {concurrency: 1})
}
