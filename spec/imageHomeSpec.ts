import { buildInputFile, createImageHome } from '../src';

describe('imageHome', () => {
  it('should allow me to register an image', async done => {
    const imageHome = createImageHome()
    expect(imageHome.isRegistered('fn.png')).toBeFalsy()
    const r = await imageHome.register('fn.png', await buildInputFile('fn.png'))
    expect(r.name).toBe('fn.png')
    expect(imageHome.isRegistered('fn.png')).toBeTruthy()
    done()
  })
})
