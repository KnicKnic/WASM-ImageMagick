// import { blobToString, buildInputFile, Call, extractInfo, compare } from '../src';
// import pmap from 'p-map'
// describe('formats', () => {

//   const formats = ['jpg', 'png', 'psd', 'tiff', 'xcd']

//   fit('should be equal', async done=>{
//     // expect(false).toBe(true)
//     const promises:Promise<boolean>[] = []
//     formats.forEach(f1=>{
//       formats.filter(f2=>f2!=f1).forEach(async f2=>{
//         promises.push(compare(await buildInputFile(`to_rotate.${f1}`), await buildInputFile(`to_rotate.${f2}`)))
//       })
//     })
// console.log({promises});

//     const results = await pmap(promises, p=>p, {concurrency: 1})
//     // const results = await    Promise.all(promises)
    
// console.log({results});
//     results.forEach(r=>{
//       expect(r).toBe(false)
//     })
//     console.log('done');
    
//     done()
//   })
// })
