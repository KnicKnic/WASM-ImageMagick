import * as Magick from 'wasm-imagemagick'

describe('assets', () => {

  it('rotate.png and magick.wasm resources should be available', async done => {
 
    let r = await fetch('magick.wasm')
    expect(r.ok).toBe(true)

    r = await fetch('rotate.png')
    expect(r.ok).toBe(true) 
 
    r = await fetch('nonexistent.png')
    expect(r.ok).toBe(false)

    done()
  })

  it('wasm-imagemagick should work', async done => {

    let fetchedSourceImage = await fetch("rotate.png");
    let arrayBuffer = await fetchedSourceImage.arrayBuffer();
    let sourceBytes = new Uint8Array(arrayBuffer);

    const inputFiles = [{ 'name': 'srcFile.png', 'content': sourceBytes }]
    const command = ["convert", "srcFile.png", "info.json"]
    let processedFiles = await Magick.Call(inputFiles, command);

    expect(processedFiles[0].name).toBe('info.json')
    const data = JSON.parse(await blobToString(processedFiles[0].blob))
    expect(data[0].image.baseName).toBe('srcFile.png')

    done()
  })
})

function blobToString(blob: Blob) : Promise<string>{
  return new Promise(resolve=>{
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve((e.srcElement as any).result)
    })
    reader.readAsText(blob)
  })
}

export default 1