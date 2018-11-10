import * as Magick from 'wasm-imagemagick'
import { blobToString, buildInputFile } from './testUtil';

describe('assets', () => {
  it('Call should print image metadata as json', async done => {

    let fetchedSourceImage = await fetch("fn.png");
    let arrayBuffer = await fetchedSourceImage.arrayBuffer();
    let sourceBytes = new Uint8Array(arrayBuffer);

    const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Magick.Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })

  it('buildImputFile should work', async done => {

    const img = await buildInputFile('fn.png', 'srcFile.png')
    const inputFiles = [img]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Magick.Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })

  xit('Call rotate and resize should output an image that is equals to the real output', async done => {

    let fetchedSourceImage = await fetch("fn.png");
    let arrayBuffer = await fetchedSourceImage.arrayBuffer();
    let sourceBytes = new Uint8Array(arrayBuffer);

    const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Magick.Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })
})


export default 1