import { getBuiltInImages, builtInImageNames, extractInfo, execute, compare } from '../../src';
import pMap from 'p-map';

export default describe('util/imageBuiltIn', () => {

  it('should get all builtIn images', async done => {
    const all = await getBuiltInImages()
    builtInImageNames.forEach(name => {
      expect(all.map(f => f.name)).toContain(name, 'does not contain image ' + name)
    })
    done()
  })

  it('should be equal and info should match', async done => {
    const all = await getBuiltInImages()
    const formats = { 'rose:': 'PPM', 'logo:': 'GIF', 'wizard:': 'GIF', 'granite:': 'GIF', 'netscape:': 'GIF' }
    await pMap(all, async img => {
      const info = await extractInfo(img)
      expect(info[0].image.format).toBe(formats[img.name])
      const { outputFiles } = await execute({ commands: `convert ${img.name} 'output.png` })
      expect(await compare(outputFiles[0], img)).toBe(true)
    }, { concurrency: 1 })
    done()
  })

})
