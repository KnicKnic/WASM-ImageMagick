import { buildInputFile, cutShape, compare, ShapeType, Rectangle, executeAndReturnOutputFile, paste, asInputFile } from "../../src";
import { equal } from "assert";
import { showImages } from "../testUtil";


export default describe('util/image', () => {

  describe('cutShape', ()=>{

    it('should return the modified image and the cutted section', async done => {
      const img1 = await buildInputFile('fn.png')
      const section : Rectangle = {type: ShapeType.Rectangle, x1: 30, y1: 20, x2: 66, y2: 77}
      const {modifiedSourceImage, cuttedSection} = await cutShape(img1, section)
      expect(await compare(img1, modifiedSourceImage)).not.toBe(true)
      await showImages([img1, cuttedSection, modifiedSourceImage])
      done()
    })
  })
  describe('paste', ()=>{

    it('should return the modified image and the cutted section', async done => {
      const img1 = await executeAndReturnOutputFile(`convert rose: -resize 50% img1.miff`)
      const img2 = await executeAndReturnOutputFile(`convert logo: -resize 50% img2.miff`)
      const {modified} = await paste(await asInputFile(img2), await asInputFile(img1), 40, 10)
      expect(await compare(img1, modified)).not.toBe(true)
      await showImages([img1, modified])
      done()
    })
  })

})
