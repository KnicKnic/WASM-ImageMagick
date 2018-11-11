import { buildInputFile, compare, extractInfo } from '../src';
import { execute, executeOne } from '../src/execute';

describe('execute', () => {

  describe('executeOne', () => {
    it('should run convert -resize', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      let info = await extractInfo(img1)
      expect(info[0].image.formatDescription.toLowerCase()).toBe('jpeg')
      expect(info[0].image.geometry.width).toBe(320)
      expect(info[0].image.geometry.height).toBe(240)

      const { outputFiles } = await executeOne({
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

  describe('execute', () => {
    it('should execute commands serially and output files are available to next commands', async done => {
      const result = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [
          ['convert', 'image1.png', "-rotate", "70", "image2.gif"],
          // heads up: next command uses "image2.gif" which was the output of previous command:
          ["convert", "image2.gif", "-scale", '23%', 'image3.jpg'],
        ]
      })
      const result2 = await executeOne({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [['convert', 'image1.png', "-rotate", "70", "-scale", '23%', "image2.gif"]]
      })
      expect(await compare(result.outputFiles.find(f => f.name === 'image3.jpg'), result2.outputFiles[0])).toBe(true)
      done()

    })
  })
})
