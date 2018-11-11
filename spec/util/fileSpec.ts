import { blobToString, buildInputFile, Call, compare, extractInfo, getFileNameExtension, inputFileToOutputFile, outputFileToInputFile } from '../../src';

describe('util/file', () => {

  describe('buildInputFile', () => {

    it('should work with relative url', async done => {
      let processedFiles = await Call(
        [await buildInputFile('fn.png', 'srcFile.png')],
        ["convert", "srcFile.png", "info.json"]
      );
      expect(processedFiles[0].name).toBe('info.json')
      const data = JSON.parse(await blobToString(processedFiles[0].blob))
      expect(data[0].image.baseName).toBe('srcFile.png')
      done()
    })

    it('should work with absolute url', async done => {
      const url = `${window.location.protocol}//${window.location.host}/fn.png`
      const img = await buildInputFile(url)
      let info = await extractInfo(img)
      expect(info[0].image.geometry.width).toBe(109)
      let processedFiles = await Call([img], ["convert", "fn.png", '-scale', '77x99!', "scaled.png"]);
      info = await extractInfo(processedFiles[0])
      expect(info[0].image.geometry.width).toBe(77)
      done()
    })
  })


  it('getFileNameExtension should work with urls', async done => {
    expect(getFileNameExtension('http://foo.co/bar.txt')).toBe('txt')
    done()
  })

  it('outputFileToInputFile should help to use output images in next commands as input images', async done => {
    const img = await buildInputFile('holocaust.jpg')
    const result1 = await Call([img], ['convert', 'holocaust.jpg', '-resize', '25%', 'holocaust.gif'])
    const info1 = await extractInfo(result1[0])
    expect(info1[0].image.geometry.width).toBe(80)
    const result2 = await Call([await outputFileToInputFile(result1[0])], ['convert', 'holocaust.gif', '-resize', '40%', 'resized.png'])
    const info2 = await extractInfo(result2[0])
    expect(info2[0].image.geometry.width).toBe(32)
    done()
  })

  it('outputFileToInputFile and inputFileToOutputFile should generate equal images', async done => {
    const img = await buildInputFile('holocaust.jpg')
    const img2 = await outputFileToInputFile(await inputFileToOutputFile(img), 'img2.jpg')
    expect(await compare(img, img2)).toBe(true)
    done()
  })
})

