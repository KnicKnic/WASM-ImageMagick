import { blobToString, buildInputFile, Call, compare, extractInfo, getFileNameExtension, inputFileToOutputFile, outputFileToInputFile, getFileName } from '../../src';

describe('util/file', () => {

  describe('buildInputFile', () => {
    async function test(urlToFnPng){
      const file = await buildInputFile(urlToFnPng)
      let processedFiles = await Call(
        [file],
        ["convert", "fn.png", "info.json"]
      )
      expect(processedFiles[0].name).toBe('info.json')
      let info = JSON.parse(await blobToString(processedFiles[0].blob))
      expect(info[0].image.baseName).toBe('fn.png')
      expect(info[0].image.geometry.width).toBe(109)
      let processedFiles2 = await Call([file], ["convert", "fn.png", '-scale', '77x99!', "scaled.png"]);
      info = await extractInfo(processedFiles2[0])
      expect(info[0].image.geometry.width).toBe(77)

    }

    it('should work with relative url and query params', async done => {
      await test('fn.png')
      await test(`fn.png?foo=999&shshs=hshshs`)
      await test(`hello/../fn.png?foo=999&shshs=hshshs`)
      done()
    })

    it('should work with absolute url and query params', async done => {
      await test(`${window.location.protocol}//${window.location.host}/fn.png`)
      await test(`${window.location.protocol}//${window.location.host}/fn.png?foo=999&shshs=hshshs`)
      await test(`${window.location.protocol}//${window.location.host}/hello/../fn.png?foo=999&shshs=hshshs`)
      done()
    })
  })


  describe('getFileNameExtension', ()=>{

    function test(url, expected){
      expect(getFileNameExtension(url)).toBe(expected)
    }

    it('should work with absolute urls and query params', async done => {
      test('http://foo.co/bar.txt', 'txt')
      test('http://foo.co/', '')
      test('http://foo.co/bar.txt?foo=1&t=asdasd', 'txt')
      done()
    })

    it('should work with relative urls and query params', async done => {
      test('foo/bar.txt?foo=1&t=asdasd', 'txt')
      test('../foo/bar.txt?foo=1&t=asdasd', 'txt')
      test('bar.txt?foo=1&t=asdasd', 'txt')
      test('/bar.txt?foo=1&t=asdasd', 'txt')
      done()
    })   

  })

  describe('getFileName', ()=>{

    function test(url, expected){
      expect(getFileName(url)).toBe(expected)
    }
    
    it('should work with absolute urls with query params', async done => {
      test('http://foo.co/bar.txt', 'bar.txt')
      test('http://foo.co/', '')
      test('http://foo.co/bar.txt?foo=1&t=asdasd', 'bar.txt')
      test('ftp://foo.co/bar.json?foo=1&t=asdasd', 'bar.json')
      done()
    })

    it('should work with relative urls with query params', async done => {
      test('foo/bar.txt?foo=1&t=asdasd', 'bar.txt')
      test('../foo/bar.txt?foo=1&t=asdasd', 'bar.txt')
      test('bar.txt?foo=1&t=asdasd', 'bar.txt')
      test('/bar.txt?foo=1&t=asdasd', 'bar.txt')
      done()
    })   
  })

  describe('outputFileToInputFile and inputFileToOutputFile', ()=>{

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
})

