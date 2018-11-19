import { buildInputFile, createImageHome } from '../src'

export default describe('imageHome', () => {

  it('should allow me to register an image', async done => {
    const imageHome = createImageHome()
    expect(imageHome.isRegistered('fn.png')).toBeFalsy()
    const r = await imageHome.register( await buildInputFile('fn.png'))
    expect(r.name).toBe('fn.png')
    expect(imageHome.isRegistered('fn.png')).toBeTruthy()
    done()
  })

  it('should allow to get all images', async done => {
    const imageHome = createImageHome()
    await imageHome.register( await buildInputFile('fn.png'))
    await imageHome.register( await buildInputFile('holocaust.jpg'))
    const all = await imageHome.getAll()
    expect(all.find(f => f.name === 'fn.png')).toBeTruthy()
    expect(all.find(f => f.name === 'holocaust.jpg')).toBeTruthy()
    done()
  })

  it('should addBuiltInImages()', async done => {

    const imageHome = createImageHome()
    let all = await imageHome.getAll()
    expect(all.find(i => i.name === 'rose:')).toBeUndefined()
    // const builtIn = await context.addBuiltInImages()
    // expect(builtIn.find(i => i.name === 'rose:')).toBeDefined()
    await imageHome.addBuiltInImages()
    all = await imageHome.getAll()// .getAllFiles()
    expect(all.find(i => i.name === 'rose:')).toBeDefined()
    done()
  })

})
