import { buildInputFile, compare, execute } from '../src'
import { showImages } from './testUtil';

export default describe('fonts and text', () => {
  it('should support rendering a ttf font file', async done => {
    const result = await execute({ inputFiles: [await buildInputFile('Vera.ttf')], commands: `convert -pointsize 48 -font Vera.ttf label:' " _ ~ ) - '  label_vera.gif` })
    await showImages(result.outputFiles)
    expect(result.exitCode).toBe(0)
    expect(await compare(await buildInputFile('Vera_output.gif'), result.outputFiles[0]))
    done()
  })
})
