import { readFileSync, writeFileSync } from "fs";
import { pwd } from "shelljs";

console.log(`${pwd()}`);

const content = readFileSync('build.sh').toString().replace(/\/code/gm, `${pwd()}`)

writeFileSync('buildLocal.sh', content)