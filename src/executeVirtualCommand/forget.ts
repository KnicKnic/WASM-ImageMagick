import { ExecuteResult } from '..';
import { CallResult } from '../magickApi';
import { flat } from '../util';
import { VirtualCommand, VirtualCommandContext, _newExecuteResult } from './VirtualCommand';
const Minimatch = require('minimatch')

/**
 * In an execute call all input and output files are stored so internal commands in the same execute have access 
 * to them. While this is helpful, if other components of an application save reference to these files Not Enought 
 * memory errors arise (particularly when building animations). 
 * 
 * The virtual command rm allow the user to control which input/output files will be remembered after execute() finish. Usage: 
 * 
 * ```forget **tmp**.miff foo/anim_00_**.miff```
 * 
 * any input/output file that matches with the expression will be removed/disposed and won't be "published" by execute() 
 */
export default {
  name: 'forget',
  predicate(c: VirtualCommandContext): boolean {
    return c.command[0] === 'forget'
  },
  async execute(c: VirtualCommandContext): Promise<ExecuteResult> {
    let matches = []
    const globs = c.command.slice(1, c.command.length)
    const files = Object.keys(c.files)
    globs.forEach(g => {
      matches = matches.concat(files.filter(f => Minimatch(f, g)))
    })
    c.virtualCommandLogs[this.name].push({ toForget: matches })
    return _newExecuteResult(c)
  },

  async postProcessResult(r: ExecuteResult): Promise<ExecuteResult> {
    const toForget: string[] = r.virtualCommandLogs[this.name].length ? flat(r.virtualCommandLogs[this.name].map(l => l.toForget||[])) : []
    // clean up any input / output file recursively from result / results
    cleanResult(r, toForget)
    return r
  }

} as VirtualCommand

function cleanResult(r: CallResult | ExecuteResult, toForget: string[]) {
  r.inputFiles = r.inputFiles.filter(f => !toForget.includes(f.name))
  r.outputFiles = r.outputFiles.filter(f => !toForget.includes(f.name));
  // TODO: should we dispose blobs / arrays somehow here?
  ((r as ExecuteResult).results || []).forEach(r2 => cleanResult(r2, toForget))
}