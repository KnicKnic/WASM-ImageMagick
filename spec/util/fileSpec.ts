import { blobToString, buildInputFile, extractInfo, Call, getFileNameExtension } from '../../src';

describe('util/file', () => {
  
  it('buildInputFile should work with Call', async done => {
    let processedFiles = await Call([await buildInputFile('fn.png', 'srcFile.png')], ["convert", "srcFile.png", "info.json"]);
    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')
    done()
  })

  it('getFileNameExtension should wirk with urls', async done => {
    expect(getFileNameExtension('http://foo.co/bar.txt')).toBe('txt')
    done()
  })
  
})

