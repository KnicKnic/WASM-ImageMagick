import { Command } from "..";

// utilities related to formating IM CLI arguments, command array to and from valid IMPLY arguments

export function arrayToIMCommand(command: Command): string {
  return command
    .map(c => c + '')
    // if it contain spaces or is parenthesis then quote it
    .map(c => (c.trim().match(/\s/) || (c.trim() === '(' || c.trim() === ')')) ? `'${c}'` : c)
    .join(' ')
}
