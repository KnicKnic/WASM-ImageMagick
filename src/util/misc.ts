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

export function isArrayOfStrings(a: any): a is string[] {
  return Array.isArray(a) && (a.length === 0 || typeof a[0]==='string')
}

export function isArrayOfArrays(a: any): a is any[][] {
  return Array.isArray(a) && (a.length === 0 || Array.isArray(a[0]))
}
export function isArrayOfArrayOfStrings(a: any): a is any[][] {
  return isArrayOfArrays(a) && (a[0][0].length==0||typeof a[0][0] === 'string')
}