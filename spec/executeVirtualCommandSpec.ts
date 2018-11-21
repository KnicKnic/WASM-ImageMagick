import { buildInputFile, compare, execute, executeAndReturnOutputFile, executeOne, extractInfo, ExecuteCommand } from '../src'
import { showImages } from './testUtil'

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
        expect(await compare(result.outputFiles[1], await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`))).toBe(true)
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
})
