import { uniqueId } from '../unique-id/unique-id.mjs'

/**
 *
 * @param {Element} element
 * @returns {string}
 */
export const getOrSetId = (element) => {
  let myId = element.getAttribute('id') ?? element.id

  if (!myId) {
    const newId = uniqueId()
    element.id = newId
    myId = newId
  }

  return myId
}
