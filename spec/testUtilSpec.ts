import * as Magick from '../src'
import { extractInfoAndTest } from './testUtil';
import { blobToString, buildInputFile } from '../src';

describe('testUtil', () => {
  
  it('buildInputFile should work with Call', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    const inputFiles = [img]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Magick.Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })

  it('extractInfoAndTest should work', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    await extractInfoAndTest(img, info=> expect(info[0].image.baseName).toBe('srcFile.png'))
    done()
  })
  
})

