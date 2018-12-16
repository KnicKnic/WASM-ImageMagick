import { compare, execute } from '../../src';
import { showImages } from '../testUtil';

export default fdescribe('fillColorSpec', () => {

  fit('allows fill colors with 2 different methods and put the output in another file', async done => {
    const result = await execute(`
    convert logo: -resize 40% 1.miff
    fill flood 1.miff 12x12 #8811aa 20% 2.miff
    ` )
    // debugger

    //  * fill flood img.miff 12x44 '#ededed' 30% outputImage.miff 
    //  * fill opaque img.miff #ed5544 #edrree 30% outputImage

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