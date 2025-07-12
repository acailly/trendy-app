import baseURL from '../base-url/base-url.mjs'

// inspired by https://betterprogramming.pub/poor-mans-island-architecture-cbcb0ac45092

/**
 *
 * @param {HTMLElement} element
 * @returns {Promise<unknown>}
 */
let load = (element) => {
  const tagName = element.tagName.toLowerCase()
  const folderName = tagName.split('-')[0]
  return import(element.dataset.module || `${baseURL}${folderName}/${tagName}.component.mjs`)
    .catch(() => {
      const isAlreadyLoaded = Boolean(customElements.get(tagName))
      if (isAlreadyLoaded) {
        // DO NOTHING
      } else {
        console.log(
          '%cComponent not found',
          'background: red; color: white; display: block;padding: 4px;border-radius: 4px;',
          tagName
        )
      }
    })
    .then(() => {
      console.log(
        '%cComponent loaded',
        'background: blue; color: white; display: block;padding: 4px;border-radius: 4px;',
        tagName
      )
    })
}

export function loadComponents() {
  document.querySelectorAll('*').forEach((element) => {
    if (element.tagName.includes('-')) {
      load(/** @type {HTMLElement} */ (element))
    }
  })
}

loadComponents()
