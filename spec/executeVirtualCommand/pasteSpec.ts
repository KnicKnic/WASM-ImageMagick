import { compare, execute } from '../../src';
import { showImages } from '../testUtil';

export default fdescribe('paste', () => {

  it('allows me to paste an image in another at a certain pos', async done => {
    const result = await execute(`
    convert rose: -rotate 22 -resize 200% 1.miff
    convert logo: -resize 20x20! 2.miff
    paste 1.miff  5x5 2.miff pasted.miff
    ` )

    expect(result.exitCode).toBe(0)
    // await showImages(result.outputFiles)

    done()
  })

  it('if no target output image is declared then the first image itself is modified', async done => {

    const result = await execute(`
convert rose: -rotate 77 -scale 155% 1.miff
convert 1.miff 2.miff
convert rose: -resize 33% -rotate -44 small.miff
paste 1.miff  30x40 small.miff
    ` )

    await showImages(result.outputFiles)
    expect(result.exitCode).toBe(0)
    expect(await compare(result.outputFiles, '1.miff', '2.miff')).not.toBe(true)


    done()
  })
  it('errors in commands', async done => {

    const result = await execute(`
paste hhfhf
    ` )
    expect(result.exitCode).not.toBe(0)
    // this is failing : paste 1.miff  30x40 small.miff
    done()
  })
  xit('if no small image to paste then try to paste last cut', async done => {
    done()
  })
  xit('pasted section could be transformed / resized according to given shape area', async done => {
    done()
  })
})