describe('assets', () => {

  it('rotate.png and magick.wasm resources should be available in orther these tests to run', async done => {
    let r = await fetch('magick.wasm')
    expect(r.ok).toBe(true)

    r = await fetch('fn.png')
    expect(r.ok).toBe(true) 
 
    r = await fetch('nonexistent.png')
    expect(r.ok).toBe(false)

    done()
  })

})


export default 1