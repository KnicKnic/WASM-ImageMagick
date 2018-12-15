import { unquote } from "./cli";
// this package represents some concepts of IM drawing commands : https://www.imagemagick.org/Usage/draw/#draw ? 
// why can we work jsut with strings - answer: I think could be easier and interesting to have basic math vector types in js like rectangles, path, point, etc

/* something that can be -draw by IM */
export interface Shape {
  type: ShapeType
}
export type ShapeRepresentation = Shape | string
export enum ShapeType {
  'Rectangle' = 'Rectangle',
  'Path' = 'Path'
}

export interface Point {
  x: number
  y: number
}
export interface Rectangle extends Shape {
  type: ShapeType.Rectangle
  a: Point
  b: Point
}
export function isRectangle(r: any): r is Rectangle {
  return r.type === ShapeType.Rectangle
}
export interface Path extends Shape, Array<Point | string> {
  type: ShapeType.Path
}
export function isPath(r: any): r is Path {
  return r.type === ShapeType.Path
}
export function shapeTpDrawCommand(s: ShapeRepresentation): string {
  if (typeof s === 'string') {
    return unquote(s)
  }
  if (isRectangle(s)) {
    return `Rectangle  ${s.a.x},${s.a.y} ${s.b.x},${s.b.y}`
  }
  if (isPath(s)) {
    return `path ${s.map(i => typeof i === 'string' ? i : (i.x + ',' + i.y)).join(' ')}`
  }
  else {
    throw new Error('dont know how to represent command for shape ' + s.type)
  }
}