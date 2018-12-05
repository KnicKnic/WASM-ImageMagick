import { addCallListener, blobToString, buildInputFile, Call, call, extractInfo, removeAllCallListeners } from '../src'

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
      // expect(result.stderr).toBeArrayOfSize(0)
      expect(result.stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
      done()
    })

    xit('should preserve empty new lines in stdout', async done => { // commented because convert -print or convert -format is breaking all following identify commands
      const result = await call([], ['convert', 'rose:', '-print', '\\n\\nfoo\\n\\n\\nbar\\n\\n', 'info:'])
      expect(result.stdout.join('\n')).toContain(`\n\nfoo\n\n\nbar\n\n`)
      done()
    })

    describe('stdout flush issues', () => {

      xit('should print last chars in stdout and stderr no matter if it doesn\'t end with new line', async done => {
        // this is currently broken because of https://github.com/kripken/emscripten/issues/7360

        let result
        result = await call([], ['identify', '-format', '%m:%f %wx%h foo', 'rose:'])
        expect(result.stdout.join('\n')).toContain(`PNM: 70x46 foo`)
        done()
      })

      it('regarding to previous error, it works if we append a new line char', async done => {
        let result
        result = await call([], ['identify', '-format', '%m:%f %wx%h foo\\n', 'rose:'])
        expect(result.stdout.join('\n')).toContain(`PNM: 70x46 foo`)

        result = await call([await buildInputFile('fn.png')], ['identify', '-format', '%m:%f %wx%h foo\\n', 'fn.png'])
        expect(result.stdout.join('\n')).toContain(`PNG:fn.png 109x145 foo`)

        done()
      })

      xit('and related to the same error, using convert info: will just break all the following commands no matter the new line', async done => {
        // this is currently broken because of https://github.com/kripken/emscripten/issues/7360
        let result
        result = await call([], ['identify', '-format', '%m:%f %wx%h foo\\n', 'rose:'])
        expect(result.stdout.join('\n')).toContain(`PNM: 70x46 foo`) // THIS works

        result = await call([], ['convert', 'rose:', '-format', '%m:%f %wx%h foo\\n', 'info:'])
        expect(result.stdout.join('\n')).toContain(`PNM: 70x46 foo`) // fails because of that issue

        result = await call([], ['identify', '-format', '%m:%f %wx%h foo\\n', 'rose:'])
        expect(result.stdout.join('\n')).toContain(`PNM: 70x46 foo`) // fails ! previous stdout comes here because lack of flush
        done()
      })
    })

    describe('addCallListener', () => {
      afterEach(() => {
        removeAllCallListeners()
      })
      it('should register afterCall alone', async done => {
        addCallListener({
          afterCall: e => {
            expect(e.callResult).toBeDefined()
            expect(e.callResult.exitCode).toBe(0)
            done()
          },
        })
        call([], ['identify', 'rose:'])
      })
      xit('removeCallListener', () => { })
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

})
