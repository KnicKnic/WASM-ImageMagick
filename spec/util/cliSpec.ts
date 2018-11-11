import { arrayToIMCommand } from '../../src';

describe('cli utils', () => {
  it('arrayToIMCommand', () => {
    expect(arrayToIMCommand(['convert', 'foo.png', '-sharpen', '10x8', 'bar.gif'])).toBe('convert foo.png -sharpen 10x8 bar.gif')

    expect(arrayToIMCommand(["convert", "foo.png", "(", "+clone", "-channel", "R", "-fx", "B", ")", "+swap", "-channel", "B", "-fx", "v.R", "bar.gif"])).toBe(`convert foo.png '(' +clone -channel R -fx B ')' +swap -channel B -fx v.R bar.gif`)
  })
})