import pMap from "p-map";
import { MagickInputFile, extractInfo , execute, asInputFile} from "..";

let builtInImages: MagickInputFile[]
export const builtInImageNames = ['rose:', 'logo:', 'wizard:', 'granite:', 'netscape:']

export async function getBuiltInImages(): Promise<MagickInputFile[]> {
  if(!builtInImages){
    builtInImages = await pMap(builtInImageNames, async name=>{
      const info = await extractInfo(name)
      const {outputFiles} = await execute({commands:`convert ${name} ${`output1.${info[0].image.format.toLowerCase()}`}`} )
      outputFiles[0].name = name
      return await asInputFile(outputFiles[0])
    })
  }
  return builtInImages
}
