import { blobToString, buildInputFile, extractInfo, Call, getFileNameExtension, inputFileToOutputFile, outputFileToInputFile } from '../../src';

describe('util/file', () => {
  
  it('buildInputFile should work with Call', async done => {
    let processedFiles = await Call(
      [await buildInputFile('fn.png', 'srcFile.png')], 
      ["convert", "srcFile.png", "info.json"]
      );
    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')
    done()
  })

  it('getFileNameExtension should work with urls', async done => {
    expect(getFileNameExtension('http://foo.co/bar.txt')).toBe('txt')
    done()
  })
  
  // fit('outputFileToInputFile should help to use output images in next commands as input images', async done => {
  //   const img = await buildInputFile('holocaust.jpg')
  //   let info = await extractInfo(img)
  //   expect(info[0].image.geometry.width)
  //   const result1 = await Call([img], ['convert', 'holocaust.jpg', '-resize', '25%', 'holocaust.gif'])
  //   // console.log(result1);
    
  //   const info1 = await extractInfo(result[0])
  //   // expect(info)
  //   const result2 = await Call([await outputFileToInputFile(result[0])], ['convert', 'holocaust'])
  //   done()
  // })
})

