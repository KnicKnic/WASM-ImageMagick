import { buildInputFile, Call, compare, extractInfo, MagickInputFile, outputFileToInputFile } from '../../src';

export default describe('util/image', () => {

  describe('compareImage', () => {

    async function test(img1: MagickInputFile, img2: MagickInputFile, expectedResult: boolean) {
      const result = await compare(img1, img2)
      expect(result).toBe(expectedResult, `Expected compareImage(${img1.name} and ${img2.name}) to return ${result}`)
    }

    it('should return true if image is the same', async done => {
      await test(await buildInputFile('fn.png', 'img1.png'), await buildInputFile('fn.png', 'img2.png'), true)
      done()
    })

    it('should return false if images are different', async done => {
      await test(await buildInputFile('fn.png', 'img1.png'), await buildInputFile('holocaust.jpg', 'img2.png'), false)
      done()
    })

    it('should return true if images are equal but different formats', async done => {
      const result = await Call([await buildInputFile('fn.png')], ['convert', 'fn.png', 'fn.jpg'])
      const img1 = await outputFileToInputFile(result[0])
      const img2 = await buildInputFile('fn.png', 'img2.png')
      await test(img1, img2, true)
      done()
    })
  })

})
