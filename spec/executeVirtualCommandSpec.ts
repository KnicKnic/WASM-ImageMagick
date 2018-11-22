import { compare, execute, executeAndReturnOutputFile, buildInputFile } from '../src'
import { absolutize } from './testUtil'

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

  describe('uniqueName', () => {
    it('uniqueName', async done => {
      const result = await execute(`
      convert rose: -rotate 22 \`uniqueName\`.gif
    `)
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles.length).toBe(1)
      done()
    })
  })

  describe('variable decl', () => {
    it('variable decl good', async done => {
      const result = await execute(`
      color='white'
      convert -size 10x6 xc:skyblue  -fill $color \\
      -draw 'point 3,2' -scale 100x60   draw_point.gif
    `)
      expect(result.exitCode).toBe(0)
      expect(await compare(result.outputFiles[0],
        await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`))).toBe(true)
      done()
    })
    it('variable decl with substitution and other reference in the same command', async done => {
      const result = await execute(`
      img1='fn.png'
      img2='foo.png'
      convert \`buildInputFile $img1\` -resize 45% $img2
    `)
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles[1].name).toBe('foo.png')
      const result2 = await execute([await buildInputFile('fn.png')], `convert fn.png -resize 45% output.png`)
      expect(await compare(result.outputFiles[1], result2.outputFiles[0])).toBe(true)
      done()
    })


    xit('variable decl from substitution ouput', async done => { //TODO: this is failing - probably we need to separate variable declaration in two plugins - variable-declaration and variable references. and put variable declarations AFTER substitution
      const result = await execute(`
         var1='\`identify rose:\`'
    `)
      expect(result.exitCode).toBe(0)
      debugger
      done()
    })

    // it('variable decl with substitution with error', async done => {
    //   const result = await execute(`
    //      var1='\`cat noexist.txt\`'
    // `)
    //   expect(result.exitCode).not.toBe(0)
    //   debugger
    //   done()
    // })
    // it('variable decl wrong - used not existent', async done => {
    //     const result = await execute(`
    //     color=white
        
    // `)
    //     expect(result.exitCode).not.toBe(0)
    //     expect(result.stderr.join('\n')).toContain('nonex.txt')
    //     done()
    //   })
  })
})
