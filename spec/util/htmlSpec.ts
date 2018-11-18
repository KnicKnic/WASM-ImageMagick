import { buildInputFile, compare, executeOne, loadImageElement } from '../../src'

export default describe('util/html', () => {

  describe('loadImageElement', () => {

    it('should display an input and output images in an html img element', async done => {
      const img1 = await buildInputFile('fn.png')
      let el = document.createElement('img')
      expect(el.src).toBeFalsy()
      await loadImageElement(img1, el)
      expect(el.src).toBeTruthy()
      let img2 = await buildInputFile(el.src, 'image2.png')
      expect(await compare(img1, img2)).toBe(true)

      const {outputFiles} = await executeOne({inputFiles: [img1], commands: ['convert fn.png -rotate 55 out.png']})
      const out = outputFiles[0]

      el = document.createElement('img')
      expect(el.src).toBeFalsy()
      await loadImageElement(out, el)
      expect(el.src).toBeTruthy()

      img2 = await buildInputFile(el.src, 'image2.png')
      expect(await compare(out, img2)).toBe(true)

      done()
    })

    xit('buildImageSrc should return png in case forceBrowserSupport=true and image is not gif, png, jpg, webp', () => {

    })
  })

})
