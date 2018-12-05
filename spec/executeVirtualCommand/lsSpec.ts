import { compare, execute } from '../../src';

export default describe('ls', () => {

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

  it('virtual command ls wildcard in substitution', async done => {
    const result = await execute(`
      convert rose: -shear 10x30 -resize 50x50! 1.miff
      convert rose: -shear 10x40 -resize 50x50! 2.miff
      convert rose: -shear 10x60 -resize 50x50! 3.miff
      convert -delay 100 \`ls *.miff\` out1.gif
      convert -delay 100 1.miff 2.miff 3.miff out2.gif
      convert out1.gif -coalesce -append out1_append.png
      convert out2.gif -coalesce -append out2_append.png
      `)
    expect(await compare(result.outputFiles.filter(f => ['out1_append.png', 'out2_append.png'].includes(f.name)))).toBe(true)
    expect(result.exitCode).toBe(0)
    done()
  })


})