import { buildInputFile, Call, compare, MagickInputFile, outputFileToInputFile } from '../../src';

export default describe('util/imageCompare', () => {

  async function test(img1: MagickInputFile | string, img2: MagickInputFile | string, expectedResult: boolean) {
    const result = await compare(img1, img2)
    expect(result).toBe(expectedResult, `Expected compareImage(${typeof img1 === 'string' ? img1 : img1.name} and ${typeof img2 === 'string' ? img2 : img2.name}) to return ${expectedResult} but returned ${result}`)
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

  it('should let me work with builtin images', async done => {
    await test('rose:', await outputFileToInputFile((await Call([], ['convert', 'rose:', 'fn.png']))[0]), true)
    await test('rose:', await outputFileToInputFile((await Call([], ['convert', 'wizard:', 'fn.png']))[0]), false)
    done()
  })

})
