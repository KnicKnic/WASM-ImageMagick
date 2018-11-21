import pmap from 'p-map'
import { asInputFile, buildInputFile, compare, execute, executeOne, extractInfo, knownSupportedReadOnlyImageFormats, 
  knownSupportedReadWriteImageFormats, knownSupportedWriteOnlyImageFormats, readFileAsText, _knownSupportedImageFormatsInFolderForTest } from '../src'
import { combinations } from '../src/util/misc'
import { showDownloadLink } from './testUtil'

export default describe('formats', () => {

  describe('compare each other and extract', () => {

    let jasmineTimeout
    const images = {}

    beforeAll(async done => {
      jasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
      await pmap(knownSupportedReadWriteImageFormats, async f => (images[f] = await buildInputFile(`formats/to_rotate.${f}`)))
      done()
    })

    afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineTimeout
    })

    combinations(knownSupportedReadWriteImageFormats, async (f1, f2) => {

      it(`${f1}, ${f2} should be equal`, async done => {
        expect(await compare(images[f1], images[f2])).toBe(true)
        done()
      })
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
      const results = await pmap(knownSupportedReadWriteImageFormats, async f => {
        return extractInfo(images[f])
      })
      results.forEach((result, i) => {
        const image = result[0].image
        const format = knownSupportedReadWriteImageFormats[i]
        expect(imFormatMap[format] || format).toBe(image.format.toLowerCase())
        expect(image.geometry.width).toBe(64)
        expect(image.mimeType).toBe(mimeTypes[format] || undefined)
      })
      done()
    })

  })

  xdescribe('particular formats not supported or working', () => { // both are write only - TODO: delete this

    it('svg is not supported', async done => {
      const img = await buildInputFile('react.svg')
      const { outputFiles, exitCode } = await executeOne({ inputFiles: [img], commands: `convert MSVG:react.svg react.tiff` })
      expect(outputFiles.length).toBe(0)
      expect(exitCode).not.toBe(0)
      // expect(errors.length).toBeGreaterThan(0)
      done()
    })

    it('djvu doesn\'t work even read only', async done => {
      const img = await buildInputFile('formats/to_rotate.djvu')
      const { outputFiles, exitCode } = await executeOne({ inputFiles: [img], commands: `convert to_rotate.djvu out.tiff` })
      // expect(await compare(img, outputFiles[0])).toBe(true)
      expect(outputFiles.length).toBe(0)
      expect(exitCode).not.toBe(0)
      // expect(errors).toBeDefined()
      // expect(errors.length).toBeGreaterThan(0)
      done()
    })

  })

  describe('formats that write only is supported', () => {
    knownSupportedWriteOnlyImageFormats.forEach(format => {
      it(`should be able to write to format ${format}`, async done => {
        const input = await buildInputFile('fn.png')
        const { outputFiles, exitCode } = await executeOne({ inputFiles: [input], commands: `convert fn.png fn.${format}` })
        expect(exitCode).toBe(0)
        expect(outputFiles[0].name).toBe(`fn.${format}`)
        // we cannot read the file, but we can at least assert on its size:
        expect((await readFileAsText(outputFiles[0])).length).not.toBe((await readFileAsText(input)).length)
        done()
      })
    })
  })

  describe('formats that read only is supported', () => {

    knownSupportedReadOnlyImageFormats.forEach(format => {
      it(`should be able to read ${format}`, async done => {

        const inputPath = _knownSupportedImageFormatsInFolderForTest.includes(format) ? `formats/${format}/img.${format}` : `formats/to_rotate.${format}`

        const pngPath = _knownSupportedImageFormatsInFolderForTest.includes(format) ? `formats/${format}/img.png` : `formats/to_rotate.png`

        const input = await buildInputFile(inputPath)
        const png = await buildInputFile(pngPath)

        expect(await compare(input, png)).toBe(true)

        const { exitCode, stdout } = await execute([input], `convert ${input.name} info:`)
        expect(exitCode).toBe(0)
        expect(stdout.join('\n').toLowerCase()).toContain(format)
        done()
      })
    })
  })

  describe('video formats', () => {

    let jasmineTimeout
    beforeAll(() => {
      jasmineTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000
    })
    afterAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineTimeout
    })

    it('read and write', async done => {

      const readWriteFormats = ['gif', 'mng']

      const files = await pmap(readWriteFormats, f => buildInputFile(`formats/video/video.${f}`), { concurrency: 1 })

      const results = await pmap(files, file => execute([file], `identify ${file.name}\nconvert -define png:swap-bytes=true -define png:preserve-colormap=true ${file.name} out.png`), { concurrency: 1 })

      await pmap(results, async (r, i) => {
        expect(r.exitCode).toBe(0)

        const info = await extractInfo(r.outputFiles[0])
        expect(info[0].image.geometry.width).toBe(320)

        expect(r.outputFiles[0].name).toContain('.png')
        const stdout = r.stdout.join().toLowerCase()
        expect(stdout).toContain(`${readWriteFormats[i]} 320x180`)
      })

      const newInput = await pmap(results, r => pmap(r.outputFiles, o => asInputFile(o), { concurrency: 1 }), { concurrency: 1 })

      const results2 = await pmap(newInput, (inputFiles, i) => execute(inputFiles,
        `convert -define png:swap-bytes=true -define png:preserve-colormap=true ${inputFiles.map(f => f.name).join(' ')} out.${readWriteFormats[i]}`), { concurrency: 1 })

      const newVideos = await pmap(results2, r => asInputFile(r.outputFiles[0]), { concurrency: 1 })

      await showDownloadLink(newVideos)

      const infos = await pmap(newVideos, extractInfo)
      infos.forEach(i => expect(i[0].image.geometry.width).toBe(320))

      const results3 = await pmap(newVideos, file => execute([file], `identify ${file.name}\nconvert ${file.name} out.png`), { concurrency: 1 })
      results3.forEach(async (r, i) => {
        const info = await extractInfo(r.outputFiles[0])
        expect(info[0].image.geometry.width).toBe(320)

        expect(r.exitCode).toBe(0)
        expect(r.outputFiles[0].name).toContain('.png')
        const stdout = r.stdout.join().toLowerCase()
        expect(stdout).toContain(`${readWriteFormats[i]} 320x180`)
      })

      done()
    })

    // fit('read only', async done=>{
    //   const readOnlyVideFormats =['avi']

    //   const files = await pmap(readOnlyVideFormats, f=>buildInputFile(`formats/video/video.${f}`), {concurrency: 1})
    //   const results = await pmap(files, file=>execute([file], `convert ${file.name} out.png`), {concurrency: 1})
    //   results.forEach((r, i)=>{
    //     expect(r.exitCode).toBe(0)
    //     expect(r.outputFiles[0].name).toContain('.png')
    //     // expect(r.stdout.join().toLowerCase()).toContain(`${readWriteFormats[i]} 256x240`)
    //   })
    //   console.log(results);

    //   done()
    // })
  })
})
