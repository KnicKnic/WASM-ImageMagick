import { Command } from '..'
import { ExecuteCommand } from '../execute'

/** generates a valid command line command from given Call/execute Command  */
export function arrayToCli(command: Command): string {
  return command
    .map(c => c + '')

    // if it contain spaces
    .map(c => (c.trim().match(/\s/)) ? `'${c}'` : c)

    // escape parenthesis
    .map(c => c.trim() === '(' ? '\\(' : c.trim() === ')' ? '\\)' : c)

    .join(' ')
}

/** generates a valie Call/execute string[] command from given command line command */
export function cliToArray(cliCommand: string): Command {
  let inString = false
  const spaceIndexes = [0]
  for (let index = 0; index < cliCommand.length; index++) {
    const c = cliCommand[index]
    if (c.match(/[\s]/im) && !inString) {
      spaceIndexes.push(index)
    }
    if (c === `'`) {
      inString = !inString
    }
  }
  spaceIndexes.push(cliCommand.length)
  const command = spaceIndexes
    .map((spaceIndex, i) => cliCommand.substring(i === 0 ? 0 : spaceIndexes[i - 1], spaceIndexes[i]).trim())
    .filter(s => !!s)

    // remove quotes
    .map(s => s.startsWith(`'`) ? s.substring(1, s.length) : s)
    .map(s => s.endsWith(`'`) ? s.substring(0, s.length - 1) : s)

    //  unescape parenthesis
    .map(s => s === `\\(` ? `(` : s === `\\)` ? `)` : s)

  return command
}

export function asCommand(c: ExecuteCommand): Command[] {
  if (typeof c === 'string') {    return asCommand([c])  }
  if (!c[0]) { return [] }
  if (typeof c[0] === 'string') {
    return (c as string[]) .map((subCommand: string) => cliToArray(subCommand))
  }
  return c as Command[]
}
