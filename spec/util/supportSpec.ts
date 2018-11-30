import { getConfigureFolders } from '../../src'

export default describe('util/support', () => {

  it('getConfigureFolders', async done => {
    const folders = await getConfigureFolders()
    expect(folders.find(f => f.includes('/.config/ImageMagick'))).toBeTruthy()
    done()
  })

})
