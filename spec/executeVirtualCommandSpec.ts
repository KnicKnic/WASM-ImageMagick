import { buildInputFile, compare, execute, executeAndReturnOutputFile, executeOne, extractInfo, ExecuteCommand } from '../src'
import { showImages, absolutize } from './testUtil'

export default describe('executeVirtualCommand', () => {

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
    xit('virtual command ls many', () => { })
    xit('virtual command ls wildcard', () => { })
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
    xit('virtual command cat many', () => { })
    xit('virtual command cat wildcard', () => { })
  })

  describe('substitution', () => {
    it('substitution', async done => {
      const result = await execute(`
      convert logo: -format '%[pixel:p{0,0}]' info:color.txt
      convert -size 10x6 xc:skyblue  -fill \`cat color.txt\` \\
      -draw 'point 3,2'         -scale 100x60   draw_point.gif
    `)
      expect(result.exitCode).toBe(0)
      expect(await compare(result.outputFiles[1], 
        await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`))).toBe(true)
      done()
    })
    it('substitution command error', async done => {
      const result = await execute(`
        convert -size 10x6 xc:skyblue  -fill \`cat nonex.txt\` \\
        -draw 'point 3,2'         -scale 100x60   draw_point.gif
    `)
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.join('\n')).toContain('nonex.txt')
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



  xdescribe('variable decl', () => {
    it('variable decl good', async done => {
      const result = await execute(`
      var1='1,2,3,4'
    `)
      expect(result.exitCode).toBe(0)
      done()
    })
    xit('variable decl with substitution', async done => {
      const result = await execute(`
        convert logo: -format '%[pixel:p{0,0}]' info:color.txt
      var1=\`cat color.txt\`
    `)
      expect(result.exitCode).toBe(0)
      done()
    })
    it('variable decl with substitution with error', async done => {
      const result = await execute(`
         var1=\`cat noexist.txt\`
    `)
      expect(result.exitCode).not.toBe(0)
      done()
    })
    // it('variable decl wrong - used not existent', async done => {
    //     const result = await execute(`
    //     convert -size 10x6 xc:skyblue  -fill \`cat nonex.txt\` \\
    //     -draw 'point 3,2'         -scale 100x60   draw_point.gif
    // `)
    //     expect(result.exitCode).not.toBe(0)
    //     expect(result.stderr.join('\n')).toContain('nonex.txt')
    //     done()
    //   })
  })
})
