import serialize from 'serialize-javascript'

export function stringify<T>(val: T): string {
  return serialize(val)
}

export function parse<T>(text: string): T {
  return eval(text)
}
