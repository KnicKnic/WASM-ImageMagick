import { compare, execute, ExecuteResult, CallResult, MagickFile } from '../../src'
import { absolutize, showImages } from '../testUtil'

export default describe('executeVirtualCommand', () => {

  xdescribe('register new one', () => {
    it('should allow me to register new virtual commands programmatically', async done => { done() })
  })

  describe('cat', () => {

    it('virtual command cat found', async done => {
      const result = await execute(`
        convert logo: -format '%[pixel:p{0,0}]' info:color.txt
        cat color.txt
      `)
      expect(result.exitCode).toBe(0)
      expect(result.stdout.join('\n')).toContain('white')

      done()
    })

    it('virtual command cat not found', async done => {
      const result = await execute(`
        convert logo: -format '%[pixel:p{0,0}]' info:color.txt
        cat nonex.txt
      `)
      expect(result.exitCode).not.toBe(0)
      expect(result.stdout.join('\n')).not.toContain('white')
      expect(result.stderr.join('\n')).toContain('nonex.txt')
      done()
    })

    it('virtual command ls wildcard', async done => {
      const result = await execute(`
      convert rose: -format 'foo_he_jo.txt' info:foo_he_jo.txt
      convert logo: -format 'foo_he_hi.txt' info:foo_he_hi.txt
      convert logo: -format 'fooasdasd.txt' info:fooasdasd.txt
      cat 'foo*_*i*.txt'
      `)
      expect(result.exitCode).toBe(0)
      expect(result.stdout.join('\n')).toContain('foo_he_hi.txt')
      expect(result.stdout.join('\n')).not.toContain('foo_he_jo.txt')
      expect(result.stdout.join('\n')).not.toContain('fooasdasd.txt')
      done()
    })
  })

  describe('buildFile', () => {

    it('good', async done => {
      const result = await execute(`
      convert \`buildFile fn.png\` -rotate 22 out.gif
      convert fn.png -rotate 22 out2.gif
      `)
      expect(result.exitCode).toBe(0)
      expect(await compare(result.outputFiles.slice(1, 3))).toBe(true)
      done()
    })

    it('with error', async done => {
      const result = await execute(`
         convert \`buildFile dontexists.png\` -rotate 22 out.gif
      `)
      expect(result.exitCode).not.toBe(0)
      done()
    })

    it('from absolute url and custom name', async done => {
      const result = await execute(`
         convert \`buildFile '${absolutize('fn.png')}' custom.png\` -rotate 22 out.gif
      `)
      expect(result.outputFiles[0].name).toBe('custom.png')
      expect(result.exitCode).toBe(0)
      done()
    })

  })

  describe('uniqueName', () => {

    it('uniqueName', async done => {
      const result = await execute(`
      convert rose: -rotate 22 foo\`uniqueName\`.gif
      convert rose: -rotate 22 \`uniqueName\`.gif
      ` )
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles[0].name).toStartWith('foo')
      expect(result.outputFiles[0].name).toEndWith('.gif')
      expect(result.outputFiles[0].name).not.toContain('uniqueName')
      done()
    })

    it('uniqueName gives unique names', async done => {
      const result = await execute(`
      convert rose: -rotate 22 \`uniqueName\`.gif
      convert rose: -rotate 22 \`uniqueName\`.gif
      `)
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles[0].name).not.toContain('uniqueName')
      expect(result.outputFiles[1].name).not.toContain('uniqueName')
      expect(result.outputFiles[0].name).not.toBe(result.outputFiles[1].name)

      const result2 = await execute(`
      convert rose: -rotate 22 \`uniqueName\`.gif
      `)
      expect(result2.exitCode).toBe(0)
      expect(result2.outputFiles[0].name).not.toContain('uniqueName')
      expect(result.outputFiles[0].name).not.toBe(result2.outputFiles[0].name)
      expect(result.outputFiles[1].name).not.toBe(result2.outputFiles[0].name)
      done()
    })
  })


  describe('cut', () => {

    it('allow me to cut a rectangle shape', async done => {

      const result = await execute(`
      convert rose: -rotate 22 -resize 200% 1.miff
      cut 1.miff 'rectangle 40,50 78,60' 1b.miff section.miff
      ` )

      expect(result.exitCode).toBe(0)
      // await showImages(result.outputFiles)
      expect(await compare(result.outputFiles[0], result.outputFiles.find(f => f.name === '1b.miff'))).not.toBe(true)
      done()
    })

    xit('allows me to use path, ellipses, etc', async done => {
      done()
    })
  })


  describe('forget', () => {

    function collectAllFiles(r: ExecuteResult | CallResult, files: MagickFile[]) {
      [].concat(r.inputFiles).concat(r.outputFiles).forEach(f => files.push(f));
      ((r as ExecuteResult).results || []).forEach(r2 => collectAllFiles(r2, files))
    }

    it('allows to remove input and output files returned by execute() to save memory', async done => {
      const result = await execute(`
      # 1.miff doesnt exsts yet so forget shount' remove it
      forget 1.miff
      convert rose: -rotate 22 -resize 10% 1.miff
      convert logo: -resize 20x20! 2tmp_jo.miff
      convert 2tmp_jo.miff nomatch.jpg
      convert rose: tmp_Also.miff
      buildFile 'fn.png' buildedWithVirtualCommands_tmp_.miff
      convert \`buildFile 'fn.png' buildedWithVirtualCommands2_tmp_.miff\` another_t_mp_as.miff
      forget '*tmp_*.miff'
      ` )

      expect(result.exitCode).toBe(0)
      const allFiles = []
      collectAllFiles(result, allFiles)

      expect(allFiles.map(f => f.name)).not.toContain('2tmp_jo.miff')
      expect(allFiles.map(f => f.name)).not.toContain('tmp_Also.miff')
      expect(allFiles.map(f => f.name)).not.toContain('buildedWithVirtualCommands_tmp_.miff')
      expect(allFiles.map(f => f.name)).toContain('nomatch.jpg')
      expect(allFiles.map(f => f.name)).toContain('1.miff')
      expect(allFiles.map(f => f.name)).toContain('another_t_mp_as.miff')
      done()
    })

  })

})