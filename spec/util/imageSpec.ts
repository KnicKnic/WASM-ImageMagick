import { buildInputFile, cutRectangle, compare, ShapeType, Rectangle } from "../../src";
import { equal } from "assert";
import { showImages } from "../testUtil";


export default describe('util/image', () => {

  describe('cutRectangle', ()=>{

    it('should return the modified image and the cutted section', async done => {
      const img1 = await buildInputFile('fn.png')
      const section : Rectangle = {type: ShapeType.Rectangle, x1: 30, y1: 20, x2: 66, y2: 77}
      const {modifiedSourceImage, cuttedSection} = await cutRectangle(img1, section)
      expect(await compare(img1, modifiedSourceImage)).not.toBe(true)
      await showImages([img1, cuttedSection, modifiedSourceImage])
      done()
    })
  })

})
