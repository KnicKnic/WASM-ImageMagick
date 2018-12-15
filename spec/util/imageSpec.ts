import { buildInputFile, cutShape, compare, ShapeType, Rectangle, executeAndReturnOutputFile, paste, asInputFile } from "../../src";
import { equal } from "assert";
import { showImages } from "../testUtil";


export default describe('util/image', () => {

  describe('cutShape', ()=>{

    it('should return the modified image and the cutted section', async done => {
      const img1 = await buildInputFile('fn.png')
      const section : Rectangle = {type: ShapeType.Rectangle, a: {x: 30, y: 20}, b: {x: 66, y: 77}}
      const {modifiedFile, sectionFile} = await cutShape(img1, section)
      expect(await compare(img1, modifiedFile)).not.toBe(true)
      expect(await compare(img1, sectionFile)).not.toBe(true)
      //TODO: sectionFile shouldn't exist inside modifiedFile  -use IM operator that looks for subimages
      // await showImages([img1, cuttedSection, modifiedSourceImage])
      done()
    })
    it('should support strings instead of shape objects', async done => {

      const img1 = await asInputFile(await executeAndReturnOutputFile(`convert \`buildFile 'fn.png'\` -resize 250% -alpha set img1.miff`))
      // const img1 = await buildInputFile('fn.png')
      const {modifiedFile, sectionFile, mask} = await cutShape(img1, 'path "M 30,40  A 30,15 0 1,1 70,20"')
      expect(await compare(img1, modifiedFile)).not.toBe(true)
      await showImages([img1, sectionFile, modifiedFile, mask])
      done()
    })
  })
  describe('paste', ()=>{

    it('should return the modified image and the cutted section', async done => {
      const img1 = await executeAndReturnOutputFile(`convert rose: -resize 50% img1.miff`)
      const img2 = await executeAndReturnOutputFile(`convert logo: -resize 50% img2.miff`)
      const {modified} = await paste(await asInputFile(img2), await asInputFile(img1), 40, 10)
      expect(await compare(img1, modified)).not.toBe(true)
      //TODO: img1 should be inside modified  use IM operator for subiages
      await showImages([img1, modified])
      done()
    })
  })

})
