import { blobToString, buildInputFile, Call, extractInfo, call } from '../src'

export default describe('call', () => {

  describe('call', () => {

    it('should resolve with stderr on errors and exitCode !=0', async done => {
      const result = await call([], ['convert', 'nonExistent.png', 'foo.gif'])
      expect(result.stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)
      expect(result.exitCode).not.toBe(0)
      done()
    })

    it('should resolve with stdout when there\'s one', async done => {
      const result = await call([], ['identify', 'rose:'])
      expect(result.stderr.length).toBe(0)
      expect(result.stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
      done()
    })

  })

  describe('Call', () => {

    it('should print image metadata as json if output file is .json', async done => {
      const processedFiles = await Call([await buildInputFile('fn.png', 'srcFile.png')], ['convert', 'srcFile.png', 'info.json'])
      expect(processedFiles[0].name).toBe('info.json')
      const data = JSON.parse(await blobToString(processedFiles[0].blob))
      expect(data[0].image.baseName).toBe('srcFile.png')
      done()
    })

    it('should be able to resize image', async done => {
      const img = await buildInputFile('fn.png')
      let info = await extractInfo(img)
      expect(info[0].image.geometry.height).toBe(145)
      const processedFiles = await Call(
        [img],
        ['convert', 'fn.png', '-rotate', '90', '-resize', '200%', 'output.png'],
      )
      expect(processedFiles[0].name).toBe('output.png')
      info = await extractInfo(processedFiles[0])
      expect(info[0].image.geometry.height).toBe(218)
      done()
    })

    xit('Call rotate and resize should output an image that is equals to the real output in the desktop', async done => {
      done()
    })

  })

})
