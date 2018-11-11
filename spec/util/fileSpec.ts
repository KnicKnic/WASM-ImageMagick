import { blobToString, buildInputFile, extractInfo, Call } from '../../src';

describe('util/file', () => {
  
  it('buildInputFile should work with Call', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    const inputFiles = [img]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })

  it('extractInfo should work', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    const info = await extractInfo(img)
    expect(info[0].image.baseName).toBe('srcFile.png')
    done()
  })
  
})

