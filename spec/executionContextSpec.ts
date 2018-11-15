import { buildInputFile, ExecutionContext, newExecutionContext } from '../src'

export default describe('executionContext', () => {

  let context: ExecutionContext

  beforeEach(async done => {
    context = newExecutionContext()
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

    const all = await context.getAllFiles()
    const namesShouldBeContained = ['img2.gif', 'img8.gif', 'img9.png', 'img1.jpg', 'img2.gif']
    namesShouldBeContained.forEach(name =>
      expect(all.find(f => f.name === name))
        .toBeTruthy(`file name ${name} not contained`),
    )
    done()
  })

  it('allows to add new files to future use', async done => {
    let all = await context.getAllFiles()
    expect(all.find(f => f.name === 'img10.jpg')).toBeFalsy()
    expect(all.find(f => f.name === 'img11.tiff')).toBeFalsy()
    context.addFiles([await buildInputFile('holocaust.jpg', 'img10.jpg')])
    all = await context.getAllFiles()
    expect(all.find(f => f.name === 'img10.jpg')).toBeTruthy()
    const result = await context.execute('convert img10.jpg -resize 10% img11.tiff')
    expect(result.outputFiles[0].name).toBe('img11.tiff')
    all = await context.getAllFiles()
    expect(all.find(f => f.name === 'img11.tiff')).toBeTruthy()
    done()
  })

  it('allow to create a new context that inherith from an existing one', async done => {
    const all1 = await context.getAllFiles()
    const context2 = newExecutionContext(context)
    const all2 = await context2.getAllFiles()
    expect(all1.map(f => f.name)).toEqual(all2.map(f => f.name))
    done()
  })

  it('should addBuiltInImages()', async done => {
    let all = await context.getAllFiles()
    expect(all.find(i => i.name === 'rose:')).toBeUndefined()
    await context.addBuiltInImages()
    all = await context.getAllFiles()
    expect(all.find(i => i.name === 'rose:')).toBeDefined()
    done()
  })
})
