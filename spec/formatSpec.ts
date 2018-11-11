import pmap from 'p-map';
import { buildInputFile, compare } from '../src';

describe('formats', () => {

  const formats = ['jpg', 'png', 'psd', 'tiff', 'xcf', 'gif', 'bmp']

  it('compare should be true for all combinations', async done => {

    const compares = []
    formats.forEach(f1 => {
      formats.filter(f2 => f2 != f1).forEach(async f2 => {
        compares.push([`to_rotate.${f1}`, `to_rotate.${f2}`])
      })
    })
    const results = await pmap(compares, async c => {
      return compare(await buildInputFile(c[0]), await buildInputFile(c[1]))
    })

    expect(results.length).toBeGreaterThan(formats.length*2)

    results.forEach((r, i) => {
      expect(r).toBe(true, `compare(${compares[i][0]}, ${compares[i][1]})`)
    })

    done()

  })

  xit('extractInfo should get correct format and size', ()=>{

  })
})
