import { buildInputFile, loadImageElement } from '../../src';

describe('util/html', () => {

  describe('loadImageElement', ()=>{
    it('should display an input image in an html img element', async done => {
      const fn = await buildInputFile('fn.png')
      const el = document.createElement('img')
      document.body.appendChild(el)

      expect(el.src).toBeFalsy()
      await loadImageElement(fn, el)
      expect(el.src).toBeTruthy()
      expect('visually check in the browser').toBe('visually check in the browser')
      done()
    })
  })
  
})