import { buildInputFile, compare, extractInfo, execute, executeOne } from '../src'

export default describe('execute', () => {

  describe('executeOne', () => {
    it('should run convert -resize', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      let info = await extractInfo(img1)
      expect(info[0].image.formatDescription.toLowerCase()).toBe('jpeg')
      expect(info[0].image.geometry.width).toBe(320)
      expect(info[0].image.geometry.height).toBe(240)

      const { outputFiles } = await executeOne({
        inputFiles: [img1],
        commands: [['convert', 'holocaust.jpg', '-resize', '123x321!', 'resized.png']],
      })
      info = await extractInfo(outputFiles[0])
      expect(info[0].image.formatDescription.toLowerCase()).toBe('png')
      expect(info[0].image.geometry.width).toBe(123)
      expect(info[0].image.geometry.height).toBe(321)
      done()
    })

    it('should support CLI like commands', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      const { outputFiles } = await executeOne({ inputFiles: [img1], commands: ['convert holocaust.jpg -resize 444x76! output.gif'] })
      expect(outputFiles[0].name).toBe('output.gif')
      const info = await extractInfo(outputFiles[0])
      expect(info[0].image.formatDescription.toLowerCase()).toBe('gif')
      expect(info[0].image.geometry.width).toBe(444)
      expect(info[0].image.geometry.height).toBe(76)
      done()
    })

    it('should return error property and empty outputFiles on error', async done => {
      const img = await buildInputFile('fn.png')
      const { outputFiles, errors } = await executeOne({ inputFiles: [img], commands: `convert nonexistent.png out.tiff` })
      expect(outputFiles.length).toBe(0)
      expect(errors).toBeDefined()
      expect(errors.length).toBeGreaterThan(0)
      done()
    })
  })

  describe('execute', () => {
    it('should execute commands serially and output files are available to next commands', async done => {
      const result = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [
          ['convert', 'image1.png', '-rotate', '70', 'image2.gif'],
          // heads up: next command uses 'image2.gif' which was the output of previous command:
          ['convert', 'image2.gif', '-scale', '23%', 'image3.jpg'],
        ],
      })
      const result2 = await executeOne({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [['convert', 'image1.png', '-rotate', '70', '-scale', '23%', 'image2.gif']],
      })
      expect(await compare(result.outputFiles.find(f => f.name === 'image3.jpg'), result2.outputFiles[0])).toBe(true)
      done()
    })

    it('supports CLI like commands', async done => {
      const { outputFiles } = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [
          'convert image1.png -rotate 70 image2.gif',
          // heads up: the next command uses 'image2.gif' which was the output of previous command:
          'convert image2.gif -scale 23% image3.jpg',
        ],
      })
      const result2 = await executeOne({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: ['convert image1.png -rotate 70 -scale 23% image2.gif'],
      })
      expect(await compare(outputFiles.find(f => f.name === 'image3.jpg'), result2.outputFiles[0])).toBe(true)
      done()
    })

    it('supports single string CLI like command', async done => {
      const { outputFiles } = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: 'convert image1.png -rotate 70 image2.gif',
      })
      expect(outputFiles[0].name).toBe('image2.gif')
      done()
    })

    describe('errors', () => {

      it('should return error property and empty outputFiles on error', async done => {
        const img = await buildInputFile('fn.png')
        const { outputFiles, errors } = await execute({ inputFiles: [img], commands: `convert nonexistent.png out.tiff` })
        expect(outputFiles.length).toBe(0)
        expect(errors).toBeDefined()
        expect(errors.length).toBeGreaterThan(0)
        done()
      })

      it('should return errors per command', async done => {
        const img = await buildInputFile('fn.png')
        const { outputFiles, errors } = await execute({
          inputFiles: [img], commands: [
            `convert fn.png out.gif`,
            `convert nonexistent.png out.tiff`,
            `convert out.gif foo.png`,
          ],
        })
        expect(outputFiles.length).toBe(2)
        expect(errors.length).toBe(3)
        expect(errors.filter(error => !!error).length).toBe(1)
        expect(errors[0]).toBeUndefined()
        expect(errors[1]).toBeDefined()
        expect(errors[2]).toBeUndefined()
        done()
      })
    })
  })

  xit('event emitter', () => { })
})
