import { buildInputFile } from '../src';
import { compare } from '../src/';

describe('compare', () => {

  it('should return true if image is the same', async done => {
    const img1 = await buildInputFile('fn.png', 'img1.png')
    const img2 = await buildInputFile('fn.png', 'img2.png')
    const result = await compare(img1, img2)
    expect(result).toBe(true)
    done()
  })

  xit('should return true for transformed image compared to same transformation in desktop', async done => {
    const img = await buildInputFile('fn.png')
    const result = await compare(img, img)
    expect(result).toBe(true)
    done()
  })
})
