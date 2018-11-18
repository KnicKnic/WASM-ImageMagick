import { getConfigureFolders } from "../../src";

// import { trimNoNewLines } from "../../src/util/misc";

export default describe('util/support', () => {

  it('getConfigureFolders', async done => {
    const folders = await getConfigureFolders()
    expect(folders.find(f => f.includes('/.config/ImageMagick'))).toBeTruthy()
    // console.log(folders);
    done()
  })

})
