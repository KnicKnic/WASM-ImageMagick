import { buildInputFile, compare, execute, executeAndReturnOutputFile, executeOne, extractInfo } from '../src'
import { showImages } from './testUtil'

export default describe('execute', () => {

  describe('executeOne', () => {
    it('should run convert -resize', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      let info = await extractInfo(img1)
      expect(info[0].image.formatDescription.toLowerCase()).toBe('jpeg')
      expect(info[0].image.geometry.width).toBe(320)
      expect(info[0].image.geometry.height).toBe(240)

      const { outputFiles } = await executeOne({
        inputFiles: [img1],
        commands: [['convert', 'holocaust.jpg', '-resize', '123x321!', 'resized.png']],
      })
      info = await extractInfo(outputFiles[0])
      expect(info[0].image.formatDescription.toLowerCase()).toBe('png')
      expect(info[0].image.geometry.width).toBe(123)
      expect(info[0].image.geometry.height).toBe(321)
      done()
    })

    it('should support CLI like commands', async done => {
      const img1 = await buildInputFile('holocaust.jpg')
      const { outputFiles } = await executeOne({ inputFiles: [img1], commands: ['convert holocaust.jpg -resize 444x76! output.gif'] })
      expect(outputFiles[0].name).toBe('output.gif')
      const info = await extractInfo(outputFiles[0])
      expect(info[0].image.formatDescription.toLowerCase()).toBe('gif')
      expect(info[0].image.geometry.width).toBe(444)
      expect(info[0].image.geometry.height).toBe(76)
      done()
    })

    it('should return error property and empty outputFiles on error', async done => {
      const { outputFiles, exitCode, stderr } = await executeOne({ inputFiles: [await buildInputFile('fn.png')], commands: `convert nonExistent.png out.tiff` })
      expect(exitCode).not.toBe(0)
      expect(outputFiles).toBeArrayOfSize(0)
      expect(stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)
      done()
    })
  })

  describe('execute', () => {
    it('should execute commands serially and output files are available to next commands', async done => {
      const result = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [
          ['convert', 'image1.png', '-rotate', '70', 'image2.gif'],
          // heads up: next command uses 'image2.gif' which was the output of previous command:
          ['convert', 'image2.gif', '-scale', '23%', 'image3.jpg'],
        ],
      })
      const result2 = await executeOne({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [['convert', 'image1.png', '-rotate', '70', '-scale', '23%', 'image2.gif']],
      })
      expect(await compare(result.outputFiles.find(f => f.name === 'image3.jpg'), result2.outputFiles[0])).toBe(true)
      done()
    })

    it('supports CLI like commands', async done => {
      const { outputFiles } = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: [
          'convert image1.png -rotate 70 image2.gif',
          // heads up: the next command uses 'image2.gif' which was the output of previous command:
          'convert image2.gif -scale 23% image3.jpg',
        ],
      })
      const result2 = await executeOne({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: ['convert image1.png -rotate 70 -scale 23% image2.png'],
      })
      const image3 = outputFiles.find(f => f.name === 'image3.jpg')
      const image2 = result2.outputFiles[0]
      expect(await compare(image3, image2)).toBe(true)
      done()
    })

    it('supports just a command when no input files are necessary', async done => {
      const { outputFiles } = await execute([
        'convert rose: -rotate 70 image2.gif',
        'convert image2.gif -scale 23% image3.jpg',
      ])
      const result2 = await execute('convert rose: -rotate 70 -scale 23% image2.png')
      const image3 = outputFiles.find(f => f.name === 'image3.jpg')
      const image2 = result2.outputFiles[0]
      // await showImages([image3, image2])
      expect(await compare(image3, image2)).toBe(true)
      done()
    })

    it('convert won\'t replace input files', async done => {
      const input = await buildInputFile('fn.png')
      const result = await execute({
        inputFiles: [input],
        commands: ['convert fn.png -rotate 10 fn.png'],
      })
      const output = result.outputFiles.find(f => f.name === 'fn.png')
      expect(output).toBeUndefined()
      done()
    })

    it('mogrify will replace input files', async done => {
      const input = await buildInputFile('fn.png')
      const result = await execute({
        inputFiles: [input],
        commands: ['mogrify -rotate 10 fn.png'],
      })
      const output = result.outputFiles.find(f => f.name === 'fn.png')
      expect(output).toBeDefined()
      const converted = await executeAndReturnOutputFile({ inputFiles: [input], commands: 'convert fn.png -rotate 10 output.png' })
      expect(await compare(output, converted)).toBe(true)
      done()
    })

    it('supports single string CLI like command', async done => {
      const { outputFiles } = await execute({
        inputFiles: [await buildInputFile('fn.png', 'image1.png')],
        commands: 'convert image1.png -rotate 70 image2.gif',
      })
      expect(outputFiles[0].name).toBe('image2.gif')
      done()
    })

    it('supports passing config properties as parameters', async done => {
      const img = await buildInputFile('fn.png')
      const result1 = await execute([img], 'convert fn.png -rotate 70 -resize 70% image2.gif')
      const out1 = result1.outputFiles[0]

      const result2 = await execute([img], `convert fn.png -rotate 70 out1.png\n convert out1.png -resize 70% out2.gif`)
      const out2 = result2.outputFiles[1]

      const result3 = await execute([img], [`convert fn.png -rotate 70 out1.png`, 'convert out1.png -resize 70% out2.gif'])
      const out3 = result3.outputFiles[1]

      const result4 = await execute([img], [['convert', 'fn.png', '-rotate', '70', 'out1.png'], ['convert', 'out1.png', '-resize', '70%', 'out2.gif']])
      const out4 = result4.outputFiles[1]

      expect(await compare(out1, out2)).toBe(true)
      expect(await compare(out1, out3)).toBe(true)
      expect(await compare(out1, out4)).toBe(true)

      done()
    })

    it('can access stdout', async done => {
      const { stdout, exitCode } = await execute(`identify rose:`)
      expect(exitCode).toBe(0)
      expect(stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
      done()
    })

    describe('errors', () => {

      it('should return error property and empty outputFiles on error', async done => {
        const img = await buildInputFile('fn.png')
        const result = await execute({ inputFiles: [img], commands: `convert nonExistent.png out.tiff` })
        expect(result.outputFiles).toBeArrayOfSize(0)
        expect(result.stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)

        expect(result.results[0].exitCode).not.toBe(0)
        expect(result.results[0].stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)
        done()
      })

      it('should return errors per command', async done => {
        const img = await buildInputFile('fn.png')
        const result = await execute({
          inputFiles: [img], commands: [
            `convert fn.png out.gif`,
            `convert nonExistent.png out.tiff`,
            `convert out.gif foo.png`,
            `identify rose:`,
          ],
        })
        expect(result.outputFiles).toBeArrayOfSize(2)
        expect(result.exitCode).not.toBe(0)

        expect(result.stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
        expect(result.stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)

        expect(result.results[3].stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
        expect(result.results[3].exitCode).toBe(0)

        expect(result.results[1].exitCode).not.toBe(0)
        expect(result.results[1].stderr.join('\n')).toContain(`'nonExistent.png': No such file or directory`)

        done()
      })
    })
  })

  describe('executeAndReturnOutputFile', () => {
    it('should return the first image', async done => {
      const out2 = await executeAndReturnOutputFile(`
      convert rose: -rotate 55 out1.png
      convert out1.png -resize 55% out2.png
      `, 'out2.png')
      expect(out2.name).toBe('out1.png')
      done()
    })

    it('should return undefined in case of error or no output files', async done => {
      expect(await executeAndReturnOutputFile(`convert rose: info:`)).toBeUndefined()
      expect(await executeAndReturnOutputFile(`convert nonExitent.png out.png`)).toBeUndefined()
      done()
    })

  })

  describe('command preprocessors', () => {
    xit('should allow to register a new preprocessor', async done => {
      done()
    })

    it('should support js templates out of the box ', async done => {
      const result = await execute(`identify <%= 'rose:' %>`)
      expect(result.exitCode).toBe(0)
      expect(result.stdout.join('\n')).toContain(`rose:=>ROSE PNM 70x46 70x46+0+0 8-bit`)
      expect()
      done()
    })

    it('lodash templates complex example', async done => {
      const command = `
<%
const img = 'fn.png'
const delay = 20
const frames = 2 // probably you want more than 2 but we want the test to run fast
const t = new Date().getTime()
const names = []
const random = (min, max) => Math.random() * (max - min) + min
const f1 = random(0.02,0.2)
const f2 = random(-0.3,-0.1)
const f3 = random(-0.2, 0.1)
const f4 = random(0.2, 0.5)
%>
# build input file with virtual command build file
buildFile fn.png
<%
  for(var i = 1; i<= frames; i++) {
    const a1 = f1 * i
    const a2 = f2 * Math.log(i + 1)
    const a3 = f3 * Math.log(i + 1)
    const a4 = f4 * Math.log(i + 1)
    const name = \`out_\${t}_\${f1}_\${f2}_\${f3}_\${f4}___\${a1}_\${a2}_\${a3}_\${a4}.miff\`
    names.push(name)
    %>
convert <%= img %> -virtual-pixel random -distort Barrel '<%= a1 %>,<%= a2 %>,<%= a3 %>,<%= a4 %>' <%= name %>
    <%
}
%>
convert -morph 6 -delay <%= delay %> <%= img %> \\
  <%= names[0] %> <%= names.join(' ') %> \\
  <%= names.reverse().join(' ') %> \\
  \`uniqueName\`.gif
`
      const result = await execute(command)
      expect(result.exitCode).toBe(0)
      done()
    })
    it('preprocessing errors', async done => {
      const command = `<%= alsda lksjdlaksjd  %>`
      const result = await execute(command)
      expect(result.exitCode).not.toBe(0)
      expect(result.clientError).toBeDefined()
      done()
    })
  })

})
