// internal misc utilities

export function values<T>(object: { [k: string]: T }): T[] {
  return Object.keys(object).map(name => object[name])
}

export function flat<T>(arr: T[][]): T[] {
  return arr.reduce((a, b) => a.concat(b))
}

// export function trimNoNewLines(s: string): string {
//   return s.replace(/^ +/, '').replace(/ +$/, '')
// }
