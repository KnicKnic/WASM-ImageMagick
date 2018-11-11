import { arrayToCli, cliToArray } from '../../src'

describe('util/cli', () => {

  describe('arrayToCli', () => {
    it('should support simple commands', () => {
      expect(arrayToCli(['convert', 'foo.png', '-sharpen', '10x8', 'bar.gif']))
      .toBe('convert foo.png -sharpen 10x8 bar.gif')

    })
    it('should escape parenthesis', () => {
      expect(arrayToCli(['convert', 'foo.png', '(', '+clone', '-channel', 'R', '-fx', 'B', ')', '+swap', '-channel', 'B', '-fx', 'v.R', 'bar.gif']))
      .toBe(`convert foo.png \\( +clone -channel R -fx B \\) +swap -channel B -fx v.R bar.gif`)
    })
    it('should quote arguments with spaces', () => {
      expect(arrayToCli(['convert', 'input foo.png', '(', '+clone', '-channel', 'R', '-fx', 'B', ')', '+swap', '-channel', 'B', '-fx', 'v.R', 'output bar.gif']))
      .toBe(`convert 'input foo.png' \\( +clone -channel R -fx B \\) +swap -channel B -fx v.R 'output bar.gif'`)
    })
  })

  describe('cliToArray', () => {

    it('should support simple commands', () => {
      expect(cliToArray(`convert foo.png -rotate 90 bar.gif`))
      .toEqual(['convert', 'foo.png', '-rotate', '90', 'bar.gif'])
    })

    it('should support commands with quoted arguments', () => {
      expect(cliToArray(`convert 'my picture.png' -rotate 90 'output image.png'`))
      .toEqual(['convert', 'my picture.png', '-rotate', '90', 'output image.png'])
    })

    it('should support escaped parenthesis', () => {
      expect(cliToArray(`convert foo.png \\( +clone -channel R -fx B \\) +swap -channel B -fx v.R bar.gif`))
      .toEqual(['convert', 'foo.png', '(', '+clone', '-channel', 'R', '-fx', 'B', ')', '+swap', '-channel', 'B', '-fx', 'v.R', 'bar.gif'])
    })
  })

})
