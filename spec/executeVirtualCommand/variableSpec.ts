import { buildInputFile, compare, execute, executeAndReturnOutputFile } from '../../src'

export default describe('executeVirtualCommand variable', () => {

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

  xit('variable decl without quotes', async done => {
    // TODO: should we support this?
    const result = await execute(`
      color=white
      convert -size 10x6 xc:skyblue  -fill $color \\
      -draw 'point 3,2' -scale 100x60   draw_point.gif
    `)
    expect(result.exitCode).toBe(0)
    expect(await compare(result.outputFiles[0],
      await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`))).toBe(true)
    done()
  })

  it('2 variable decls and one used as part of final argument', async done => {
    const result = await execute(`
      color1='skyblue'
      color2='white'
      convert -size 10x6 xc:$color1 -fill $color2 \\
      -draw 'point 3,2' -scale 100x60   draw_point.gif
    `)
    expect(result.exitCode).toBe(0)
    expect(await compare(result.outputFiles[0],
      await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`))).toBe(true)
    done()
  })

  it('variable decl should give error if more than 1 variable is declared in same line', async done => {
    let result = await execute(`
      color='white' color2=blue
      convert -size 10x6 xc:skyblue  -fill $color \\
      -draw 'point 3,2' -scale 100x60   draw_point.gif
    `)
    expect(result.exitCode).not.toBe(0)
    result = await execute(`
      color='white' \\
      color2=blue
      convert -size 10x6 xc:skyblue  -fill $color \\
      -draw 'point 3,2' -scale 100x60   draw_point.gif
    `)
    expect(result.exitCode).not.toBe(0)
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

  it('variable decl together with substitution and part of argument', async done => {
    const result = await execute(`
      img1='fn.png'
      outputExtension='png'
      convert \`buildInputFile $img1\` -resize 45% \`uniqueName\`.$outputExtension
    `)
    expect(result.exitCode).toBe(0)
    expect(result.outputFiles[1].name.endsWith('.png')).toBe(true)
    expect(result.outputFiles[0].name).toBe('fn.png')
    const result2 = await execute([await buildInputFile('fn.png')], `convert fn.png -resize 45% output.png`)
    expect(await compare(result.outputFiles[1], result2.outputFiles[0])).toBe(true)
    done()
  })

  xit('variable decl from substitution ouput', async done => {
    // TODO: this is failing - probably we need to separate variable declaration in two plugins - variable-declaration and variable references.
    // and put variable declarations AFTER substitution
    const result = await execute(`
         var1='\`identify rose:\`'
    `)
    expect(result.exitCode).toBe(0)
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
