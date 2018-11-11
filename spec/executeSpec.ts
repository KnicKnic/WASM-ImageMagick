import { buildInputFile, extractInfo } from '../src';
import { executeOne } from '../src/execute';

describe('execute', () => {

  describe('executeOne', () => {
    it('should run convert -resize', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      let info = await extractInfo(img1)
      expect(info[0].image.formatDescription.toLowerCase()).toBe('jpeg')
      expect(info[0].image.geometry.width).toBe(320)
      expect(info[0].image.geometry.height).toBe(240)

      const {outputFiles} = await executeOne({
        inputFiles: [img1],
        commands: [['convert', 'holocaust.jpg', "-resize", "123x321!", 'resized.png']]
      })
      info = await extractInfo(outputFiles[0])
      expect(info[0].image.formatDescription.toLowerCase()).toBe('png')
      expect(info[0].image.geometry.width).toBe(123)
      expect(info[0].image.geometry.height).toBe(321)
      
      done()
    })
  })

  // xdescribe('execute', () => {

  //   const result = await execute({
  //       inputFiles: [image1],
  //       commands: [
  //         ['convert', 'image1.png', "-bordercolor", "#ffee44", "-background", "#eeff55", "+polaroid", "image2.png"], 
  //         // heads up: next command uses "image2.png" which was the output of previous command:
  //         ["convert", "image2.png", "-fill", "#997711", "-tint", "55"],
  //       ]
  //      })
  // })
})
