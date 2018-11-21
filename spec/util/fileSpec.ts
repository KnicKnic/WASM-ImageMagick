import {
  blobToString, buildInputFile, Call, compare, extractInfo, getFileNameExtension, getFileName, asInputFile,
  asOutputFile, executeAndReturnOutputFile, isImage, readFileAsText, getPixelColor, getBuiltInImages, getBuiltInImage
} from '../../src'
import { showImages, absolutize } from '../testUtil';

export default describe('util/file', () => {

  describe('buildInputFile', () => {
    async function test(urlToFnPng) {
      const file = await buildInputFile(urlToFnPng)
      const processedFiles = await Call(
        [file],
        ['convert', 'fn.png', 'info.json'],
      )
      expect(processedFiles[0].name).toBe('info.json')
      let info = JSON.parse(await blobToString(processedFiles[0].blob))
      expect(info[0].image.baseName).toBe('fn.png')
      expect(info[0].image.geometry.width).toBe(109)
      const processedFiles2 = await Call([file], ['convert', 'fn.png', '-scale', '77x99!', 'scaled.png'])
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
      await test(absolutize(`fn.png`))
      await test(absolutize(`fn.png?foo=999&shshs=hshshs`))
      await test(absolutize(`hello/../fn.png?foo=999&shshs=hshshs`))
      done()
    })
    it('error', async done => {
      buildInputFile('dontexists.png').then(()=>{expect('resolved').toBe('rejected'); done()}).catch(()=>{expect('rejected').toBe('rejected'); done()})
    })

    it('should support data:// urls with embedded image content', async done => { 
      const img = await buildInputFile('fn.png')
      const els = await showImages(img)
      const img2 = await buildInputFile(els[0].src)
      expect(await compare(img, img2)).toBe(true)
      done()
    })
  })

  describe('asInputFile and asOutputFile', () => {

    it('asInputFile should help to use output images in next commands as input images', async done => {
      const img = await buildInputFile('holocaust.jpg')
      const result1 = await Call([img], ['convert', 'holocaust.jpg', '-resize', '25%', 'holocaust.gif'])
      const info1 = await extractInfo(result1[0])
      expect(info1[0].image.geometry.width).toBe(80)
      const result2 = await Call([await asInputFile(result1[0])], ['convert', 'holocaust.gif', '-resize', '40%', 'resized.png'])
      const info2 = await extractInfo(result2[0])
      expect(info2[0].image.geometry.width).toBe(32)
      done()
    })

    it('asInputFile and asOutputFile should generate equal images', async done => {
      const img = await buildInputFile('holocaust.jpg')
      const img2 = await asInputFile(await asOutputFile(img), 'img2.jpg')
      expect(await compare(img, img2)).toBe(true)
      done()
    })
  })

  describe('readFileAsText and isImage, getPixelColor, getBuiltInImage', () => { // TODO: separate
    it('basic test', async done => {
      const file = await executeAndReturnOutputFile(`convert logo: -format '%[pixel:p{0,0}]' info:info.txt`)
      expect(await isImage(file)).toBe(false)
      expect(await readFileAsText(file)).toBe('white')
      const file2 = await buildInputFile('fn.png')
      expect(await isImage(file2)).toBe(true)
      expect(await readFileAsText(file2)).toContain('PNG')
      expect(await getPixelColor(await getBuiltInImage('logo:'), 0, 0)).toBe('white')
      done()
    })
  })

  describe('getFileNameExtension', () => {

    function test(url, expected) {
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

  describe('getFileName', () => {

    function test(url, expected) {
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
})
