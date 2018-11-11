import { buildInputFile } from '../src';

describe('assets', () => {

  it('should print image metadata as json if output file is .json', async done => {
    const img = await buildInputFile('fn.png', 'srcFile.png')
    done()
  })

  xit('Call rotate and resize should output an image that is equals to the real output', async done => {

    done()
  })
})
