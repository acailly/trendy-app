import { getOrSetId } from '../get-or-set-id/get-or-set-id.mjs'

export const HTML_ACTION_EVENT = new Event('htmlAction')

/**
 * @template {Element} T
 * @param {T} element
 * @returns {T}
 */
export const htmlAction = (element) => {
  return new Proxy(element, {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver)
      if (typeof targetValue === 'function') {
        return function (/** @type {unknown[]} */ ...args) {
          const elementId = getOrSetId(element)
          return `${elementId}.${String(propKey)}(${args.map(htmlActionArgument).join(',')})`
        }
      } else {
        throw Error('only function can be used as htmlAction')
      }
    },
  })
}

/**
 * @param {unknown} arg
 * @returns {string | number | undefined | boolean | bigint}
 */
const htmlActionArgument = (arg) => {
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

  if (arg === HTML_ACTION_EVENT) {
    return 'event'
  }

  if (typeof arg === 'number') {
    return arg
  }

  if (typeof arg === 'boolean') {
    return arg
  }

  if (typeof arg === 'bigint') {
    return arg
  }

  if (typeof arg === 'undefined') {
    return undefined
  }

  if (typeof arg === 'string') {
    return `'${arg.replace("'", "\\'")}'`
  }

  if (typeof arg === 'object') {
    // because typeof null returns 'object'
    if (arg === null) {
      return 'null'
    }
    throw new Error('Object are not handled')
  }

  if (typeof arg === 'function') {
    throw new Error('Functions are not handled')
  }

  if (typeof arg === 'symbol') {
    throw new Error('Symbol are not handled')
  }

  throw new Error(`Unrecognized type: ${typeof arg}`)
}
