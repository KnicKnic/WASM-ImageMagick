import { MagickInputFile, MagickOutputFile } from "../src";
import { extractInfo } from "../src/util/image";

export async function extractInfoAndTest(img: MagickInputFile | MagickOutputFile, predicate: (info: any) => boolean | void = info => info[0].image.baseName === img.name): Promise<boolean> {
  const info = await extractInfo(img)
  return !!predicate(info)
}

