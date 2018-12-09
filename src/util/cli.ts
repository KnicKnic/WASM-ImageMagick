import { Command } from '..'
import { ExecuteCommand } from '../execute'
import { flat, isArrayOfStrings, isArrayOfArrayOfStrings } from './misc'

/**
 * Generates a valid command line command from given `string[]` command. Works with a single command.
 */
function arrayToCliOne(command: Command): string {
  return command
    .map(c => c + '')

    // if it contain spaces
    .map(c => (c.trim().match(/\s/)) ? `'${c}'` : c)

    // escape parenthesis
    .map(c => c.trim() === '(' ? '\\(' : c.trim() === ')' ? '\\)' : c)

    .join(' ')
}

/**
 * Generates a valid command line string from given `string[]` that is compatible with  {@link call}. Works with multiple
 * commands by separating  them with new lines and support comand splitting in new lines using `\`.
 * See {@link ExecuteCommand} for more information.
 */
export function arrayToCli(command: Command | Command[]): string {
  const cmd = typeof command[0] === 'string' ? [command as Command] : command as Command[]
  return cmd.map(arrayToCliOne).join('\n')
}

/**
 * Generates a command in the form of array of strings, compatible with {@link call} from given command line string . The string must contain only one command (no newlines).
 */
export function cliToArrayOne(cliCommand: string): Command {
  if (cliCommand.trim().startsWith('#')) {
    return undefined
  }
  let inString = false
  const spaceIndexes = [0]
  for (let index = 0; index < cliCommand.length; index++) {
    const c = cliCommand[index]
    if (c.match(/[ ]/im) && !inString) {
      spaceIndexes.push(index)
    }
    if (c === `'`) {
      inString = !inString
    }
  }
  spaceIndexes.push(cliCommand.length)
  const command = spaceIndexes
    // .map((spaceIndex, i) => cliCommand.substring(i === 0 ? 0 : spaceIndexes[i - 1], spaceIndexes[i]).trim())
    .map((spaceIndex, i) => cliCommand.substring(i === 0 ? 0 : spaceIndexes[i - 1], spaceIndexes[i]).replace(/^[ ]+/, '').replace(/[ ]+$/, ''))
    .filter(s => !!s)

    // remove quotes
    .map(s => s.startsWith(`'`) ? s.substring(1, s.length) : s)
    .map(s => s.endsWith(`'`) ? s.substring(0, s.length - 1) : s)

    //  unescape parenthesis
    .map(s => s === `\\(` ? `(` : s === `\\)` ? `)` : s)

    .map(s=>s.replace(/\\n/g, '\n')) // so `%w\\n` is transformed to `%w\n' - we cant have new lines because of cliToArray split('\n') - so user must escape it and here we unescape
    // .map(s=>s)
  // debugger1
  return command
}

/**
 * Generates a command in the form of `string[][]` that is compatible with {@link call} from given command line string.
 * This works for strings containing multiple commands in different lines. and also respect `\` character for continue the same
 * command in a new line. See {@link ExecuteCommand} for more information.
 */
export function cliToArray(cliCommand: string): Command[] {
  const lines = cliCommand.split('\n')
    .map(s => s.trim())
    .map(cliToArrayOne)
    .filter(a => a && a.length)
  const result = []
  let currentCommand: Command = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line[line.length - 1] !== '\\') {
      currentCommand = currentCommand.concat(line)
      result.push(currentCommand)
      currentCommand = []
    }
    else {
      currentCommand = currentCommand.concat(line.slice(0, line.length - 1))
    }
  }
  return result
}

/**
 * TODO: move to execute.ts
 * Makes sure that given {@link ExecuteCommand}, in whatever syntax, is transformed to the form `string[][]` that is compatible with {@link call}
 */
export function asCommand(c: ExecuteCommand): Command[] {
  if (!c) {return []}
  if (typeof c === 'string') { return asCommand([c]) }
  if (!c[0]) { return [] }
  if (isArrayOfStrings(c)) {
    return flat(c.map(cliToArray))
  }
  if (isArrayOfArrayOfStrings(c)) {
    // this means that the command is already a valid Command. This means that Execute Commands cannot be [['convert a'], ['convert b']]
    return c as Command[]
  }

}

export function unquote(s: string): string {
  s = s.startsWith('\'') ? s.substring(1, s.length) : s
  return s.endsWith('\'') ? s.substring(0, s.length - 1) : s
}
