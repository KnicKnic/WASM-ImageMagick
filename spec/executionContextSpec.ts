import { buildInputFile, ExecutionContext } from '../src'

export default describe('executionContext', () => {

  let context: ExecutionContext

  beforeEach(async done => {
    context = new ExecutionContext()
    const result = await context.execute({
      inputFiles: [await buildInputFile('holocaust.jpg', 'img1.jpg')],
      commands: ['convert img1.jpg -resize 44% img2.gif'],
    })
    expect(result.outputFiles[0].name).toBe('img2.gif')
    done()
  })

  it('remember previous input and output files and support execute() command array remembering', async done => {
    const result = await context.execute({
      inputFiles: [],
      commands: [
        'convert img1.jpg -resize 44% img3.gif',
        'convert img2.gif -rotate 55 img4.tiff',
        'convert img4.tiff -resize %123 img5.jpg',
      ],
    })
    expect(result.outputFiles[0].name).toBe('img3.gif')
    expect(result.outputFiles[1].name).toBe('img4.tiff')
    expect(result.outputFiles[2].name).toBe('img5.jpg')
    done()
  })

  it('allows to use ExecuteCommand only syntax (no inputFiles)', async done => {
    const result = await context.execute(['convert img2.gif -resize 22% -rotate 22 img6.gif'])
    expect(result.outputFiles[0].name).toBe('img6.gif')
    done()
  })

  it('allows to use a single string command syntax', async done => {
    const result = await context.execute('convert img2.gif -resize 22% -rotate 22 img7.gif')
    expect(result.outputFiles[0].name).toBe('img7.gif')
    done()
  })

  it('allows get all images currently available', async done => {
    const result = await context.execute([
      'convert img2.gif -resize 22% -rotate 22 img8.gif',
      'convert img8.gif -rotate 55 img9.png',
    ])
    expect(result.outputFiles[0].name).toBe('img8.gif')
    expect(result.outputFiles[1].name).toBe('img9.png')

    const all = await context.getAllFiles();
    ['img2.gif', 'img8.gif', 'img9.png', 'img1.jpg', 'img2.gif']
      .forEach(name =>
        expect(all.find(f => f.name === name))
          .toBeTruthy(`file name ${name} not contained`),
      )
    done()
  })
})
