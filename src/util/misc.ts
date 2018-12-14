import { ExecuteResult } from "../execute";

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
  return Array.isArray(a) && (a.length === 0 || typeof a[0] === 'string')
}

export function isArrayOfArrays(a: any): a is any[][] {
  return Array.isArray(a) && (a.length === 0 || Array.isArray(a[0]))
}
export function isArrayOfArrayOfStrings(a: any): a is any[][] {
  return isArrayOfArrays(a) && (a[0][0].length === 0 || typeof a[0][0] === 'string')
}
export function combinations<T>(arr: T[], fn: (a: T, b: T) => Promise<any>): Promise<any> {
  const promises = []
  arr.forEach(f1 => {
    arr.
      filter((f2, i, subarr) => i > subarr.indexOf(f1))
      .forEach(f2 => promises.push(fn(f1, f2)))
  })
  return Promise.all(promises)
}

export function jsonParseOr<K>(s: string, defaultValue: K): K {
  let val : K = defaultValue
  try {
    val = JSON.parse(s)
  } catch (error) {
  }
  return val
}

export function jsonStringifyOr(o: any, defaultValue: string, pretty: boolean=false): string {
  try {
    return pretty ? JSON.stringify(o, null, 2) : JSON.stringify(o)
  } catch (error) {
    return defaultValue
  }
}
