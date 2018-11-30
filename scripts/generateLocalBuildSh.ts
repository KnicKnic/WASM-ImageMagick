import { readFileSync, writeFileSync } from 'fs'
import { pwd } from 'shelljs'

const content = readFileSync('build.sh').toString().replace(/\/code/gm, `${pwd()}`)

writeFileSync('buildLocal.sh', content)
