import pmap from 'p-map'
import { buildInputFile, compare, execute, executeOne, extractInfo } from '../src'

export default describe('formats', () => {

  // heads up - all images spec/assets/to_rotate.* where converted using gimp unless explicitly saying otherwhise
  const formats = [
    'jpg', 'png',
    'psd',
    'tiff', 'xcf', 'gif', 'bmp', 'tga', 'miff', 'ico', 'dcm', 'xpm', 'pcx',
    //  'pix', // gives error
    'fits',
    // 'djvu', // read only support
    'ppm',
    'pgm',
    'pfm',
    'mng',
    'hdr',
    'dds', // generated using convert -define "dds:compression={dxt1, dxt5, none}" to_rotate.png  to_rotate.dds
    'otb', // generated using convert to_rotate.png  to_rotate.otb

    'txt', // generated using convert to_rotate.png  to_rotate.txt

    // 'rgb', // fails because  MustSpecifyImageSize `to_rotate.rgb' 
  ]

  const descriptions = {
    psd: 'Adobe Photoshop bitmap file'
  }

  describe('compare and assert on info', ()=>{

    let jasmineTimeout

    beforeAll(() => {
      jasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
    })
  
    afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineTimeout
    })
  
    it('compare should be true for all combinations', async done => {
      const compares = []
      formats.forEach(f1 => {
        formats.filter(f2 => f2 !== f1).forEach(async f2 => {
          compares.push([`formats/to_rotate.${f1}`, `formats/to_rotate.${f2}`])
        })
      })
      const results = await pmap(compares, async c => {
        return compare(await buildInputFile(c[0]), await buildInputFile(c[1]))
      })
      expect(results.length).toBeGreaterThan(formats.length * 2)
      results.forEach((r, i) => {
        expect(r).toBe(true, `compare(${compares[i][0]}, ${compares[i][1]})`)
      })
      done()
    })
  
    it('info format should match', async done => {
  
      const mimeTypes = {
        jpg: 'image/jpeg',
        png: 'image/png',
        tiff: 'image/tiff',
        gif: 'image/gif',
        ppm: 'image/x-portable-pixmap',
        pnm: 'image/x-portable-greymap',
        pgm: 'image/x-portable-greymap',
        mng: 'video/x-mng',
      }
      const imFormatMap = {
        jpg: 'jpeg',
        pnm: 'pgm',
      }
      const results = await pmap(formats, async f => {
        return extractInfo(await buildInputFile(`formats/to_rotate.${f}`))
      })
      results.forEach((result, i) => {
        const image = result[0].image
        const format = formats[i]
        expect(imFormatMap[format] || format).toBe(image.format.toLowerCase())
        expect(image.geometry.width).toBe(64)
        expect(image.mimeType).toBe(mimeTypes[format] || undefined)
        console.log(image)
      })
      done()
    })
  
  })


  describe('particular formats not supported or working', ()=>{

    it('svg is not supported', async done => {
      const img = await buildInputFile('react.svg')
      const { outputFiles, errors } = await executeOne({ inputFiles: [img], commands: `convert MSVG:react.svg react.tiff` })
      expect(outputFiles.length).toBe(0)
      expect(errors).toBeDefined()
      expect(errors.length).toBeGreaterThan(0)
      done()
    })
  
    it('djvu doesn\'t work even read only', async done => {
      const img = await buildInputFile('formats/to_rotate.djvu')
      const { outputFiles, errors } = await executeOne({ inputFiles: [img], commands: `convert to_rotate.djvu out.tiff` })
      // expect(await compare(img, outputFiles[0])).toBe(true)
      expect(outputFiles.length).toBe(0)
      expect(errors).toBeDefined()
      expect(errors.length).toBeGreaterThan(0)
      done()
    })

  })
})
