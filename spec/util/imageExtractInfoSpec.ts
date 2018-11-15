import { buildInputFile, extractInfo } from '../../src';

export default describe('util/imageExtractInfo', () => {

  it('should work', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    const info = await extractInfo(img)

    expect(info[0].image.baseName).toBe('srcFile.png')
    expect(info[0].image.geometry.height).toBe(145)
    done()
  })

  it('should extract info from built-in images', async done => {
    const info = await extractInfo('rose:')
    expect(info[0].image.geometry.width).toBe(70)
    expect(info[0].image.geometry.height).toBe(46)
    expect(info[0].image.format).toBe('PNM')
    done()
  })

  xit('should extract info from several images', () => {
    // not implemented yet
  })

})
