import { buildInputFile, loadImageElement, compare, execute } from '../../src'

export default describe('util/html', () => {

  describe('loadImageElement', () => {

    it('should display an input image in an html img element', async done => {
      const img1 = await buildInputFile('fn.png')
      const el = document.createElement('img')
      document.body.appendChild(el)

      expect(el.src).toBeFalsy()
      await loadImageElement(img1, el)
      expect(el.src).toBeTruthy()
      expect('visually check in the browser').toBe('visually check in the browser')

      const img2 = await buildInputFile(el.src, 'image2.png')

      expect(await compare(img1, img2)).toBe(true)
      done()
    })

    xit('should display an output image in an html img element', async done => {
      // const result = execute({inputFiles: [await buildInputFile('fn.png')], commands :[ 'convert fn.png -rotate 90 out.git'])

      // const el = document.createElement('img')
      // document.body.appendChild(el)

      // expect(el.src).toBeFalsy()
      // await loadImageElement(img1, el)
      // expect(el.src).toBeTruthy()
      // expect('visually check in the browser').toBe('visually check in the browser')

      // const img2 = await buildInputFile(el.src, 'image2.png')

      // expect(await compare(img1, img2)).toBe(true)
      done()
    })

    xit('buildImageSrc should return png in case forceBrowserSupport=true and image is not gif, png, jpg, webp', () => {

    })
  })

})
