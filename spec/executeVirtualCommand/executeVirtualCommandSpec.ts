import { compare, execute, executeAndReturnOutputFile, buildInputFile } from '../../src'
import { absolutize } from '../testUtil'

export default describe('executeVirtualCommand', () => {

  xdescribe('register new one', () => {
    it('should allow me to register new virtual commands programmatically', async done => { done() })
  })

  describe('ls', () => {

    it('virtual command ls found', async done => {
      const result = await execute(`
      convert rose: -rotate 55 out1.png
      ls out1.png
      `)
      expect(result.exitCode).toBe(0)
      expect(result.stdout.join('\n')).toContain('out1.png')
      done()
    })

    it('virtual command ls not found', async done => {
      const result = await execute(`
      convert rose: -rotate 55 out1.png
      ls nonex.png
      `)
      expect(result.exitCode).not.toBe(0)
      expect(result.stdout.join('\n')).not.toContain('out1.png')
      expect(result.stderr.join('\n')).toContain('nonex.png')
      done()
    })

    it('virtual command ls wildcard', async done => {
      const result = await execute(`
      convert rose: -rotate 55 foo_out1.png
      convert logo: -rotate 55 var_out2.png
      convert logo: -rotate 55 var_out3.gif
      convert logo: -rotate 55 foo_jo__jo_out4.png
      ls 'foo*_*.png'
      `)
      expect(result.exitCode).toBe(0)
      expect(result.stdout).toEqual(['foo_out1.png', 'foo_jo__jo_out4.png'])
      done()
    })

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

  describe('buildInputFile', () => {

    it('buildInputFile good', async done => {
      const result = await execute(`
      convert \`buildInputFile fn.png\` -rotate 22 out.gif
      convert fn.png -rotate 22 out2.gif
    `)
      expect(result.exitCode).toBe(0)
      expect(await compare(result.outputFiles.slice(1, 3))).toBe(true)
      done()
    })

    it('buildInputFile with error', async done => {
      const result = await execute(`
         convert \`buildInputFile dontexists.png\` -rotate 22 out.gif
    `)
      expect(result.exitCode).not.toBe(0)
      done()
    })

    it('buildInputFile from absolute url and custom name', async done => {
      const result = await execute(`
         convert \`buildInputFile '${absolutize('fn.png')}' custom.png\` -rotate 22 out.gif
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
    `)
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles[0].name.startsWith('foo')).toBe(true)
      expect(result.outputFiles[0].name.endsWith('.gif')).toBe(true)
      done()
    })

    it('uniqueName gives unique names', async done => {
      const result = await execute(`
      convert rose: -rotate 22 \`uniqueName\`.gif
    `)
      expect(result.exitCode).toBe(0)
      const result2 = await execute(`
      convert rose: -rotate 22 \`uniqueName\`.gif
    `)
      expect(result2.exitCode).toBe(0)
      expect(result.outputFiles[0].name).not.toBe(result2.outputFiles[0].name)
      done()
    })
  })

})
