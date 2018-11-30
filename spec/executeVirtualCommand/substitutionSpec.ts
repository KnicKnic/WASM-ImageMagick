import { buildInputFile, compare, execute, executeAndReturnOutputFile, asCommand } from '../../src'
import { resolveCommandSubstitution } from '../../src/executeVirtualCommand/substitution'

export default describe('substitution', () => {

  describe('resolveCommandSubstitution', () => {

    it('simple', () => {
      const result = resolveCommandSubstitution(asCommand(`convert \`foo\` foo2.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'foo2.png',
        ],
        substitution: {
          index: 1,
          command: [
            'foo',
          ],
          restStart: '',
          restEnd: '',
        },
      })
    })

    it('command with multiple args', () => {
      const result = resolveCommandSubstitution(asCommand(`convert \`foo 1 two three.png 'four and 4'\` foo2.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'foo2.png',
        ],
        substitution: {
          index: 1,
          command: [
            'foo',
            '1',
            'two',
            'three.png',
            'four and 4',
          ],
          restStart: '',
          restEnd: '',
        },
      })
    })

    it('command with 1 arg and postfix', () => {
      const result = resolveCommandSubstitution(asCommand(`convert  foo2.png \`uniqueName\`.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'foo2.png',
        ],
        substitution: {
          index: 2,
          command: [
            'uniqueName',
          ],
          restStart: '',
          restEnd: '.png',
        },
      })
    })

    it('command with multiple args and postfix', () => {
      const result = resolveCommandSubstitution(asCommand(`convert rose: -resize \`cat xCoord.txt\`x55 foo2.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'rose:',
          '-resize',
          'foo2.png',
        ],
        substitution: {
          index: 3,
          command: [
            'cat', 'xCoord.txt',
          ],
          restStart: '',
          restEnd: 'x55',
        },
      })
    })

    it('command with multiple args and prefix', () => {
      const result = resolveCommandSubstitution(asCommand(`convert prefix\`foo 1 two three.png 'four and 4'\` foo2.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'foo2.png',
        ],
        substitution: {
          index: 1,
          command: [
            'foo',
            '1',
            'two',
            'three.png',
            'four and 4',
          ],
          restStart: 'prefix',
          restEnd: '',
        },
      })
    })

    it('command with both prefix and suffix', () => {
      const result = resolveCommandSubstitution(asCommand(`convert prefix\`foo 1 two three.png 'four and 4'\`postfix foo2.png`)[0].map(s => s + ''))
      expect(result).toEqual({
        fixedCommand: [
          'convert',
          'foo2.png',
        ],
        substitution: {
          index: 1,
          command: [
            'foo',
            '1',
            'two',
            'three.png',
            'four and 4',
          ],
          restStart: 'prefix',
          restEnd: 'postfix',
        },
      })
    })
  })

  describe('virtual commands', () => {

    it('substitution simple', async done => {
      const result = await execute(`
      convert logo: -format '%[pixel:p{0,0}]' info:color.txt
      convert -size 10x6 xc:skyblue  -fill \`cat color.txt\` \\
        -draw 'point 3,2' -scale 100x60  draw_point.gif
    `)
      expect(result.exitCode).toBe(0)
      expect(await compare(result.outputFiles[1],
        await executeAndReturnOutputFile(`convert -size 10x6 xc:skyblue -fill white -draw 'point 3,2' -scale 100x60 draw_point2.gif`)),
        ).toBe(true)
      done()
    })

    it('substitution part of argument', async done => {
      const result = await execute(`
        convert rose: -rotate 22 foo\`uniqueName\`.gif
      `)
      expect(result.exitCode).toBe(0)
      expect(result.outputFiles[0].name).toStartWith('foo')
      expect(result.outputFiles[0].name).toEndWith('.gif')
      expect(result.outputFiles[0].name).not.toContain('uniqueName')
      done()
    })

    it('substitution command error', async done => {
      const result = await execute(`
        convert - size 10x6 xc: skyblue  - fill \`cat nonex.txt\` \\
        -draw 'point 3,2'         -scale 100x60   draw_point.gif
    `)
      expect(result.exitCode).not.toBe(0)
      expect(result.stderr.join('\n')).toContain('nonex.txt')
      done()
    })

  })
})
