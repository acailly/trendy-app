// There are many types of navigations
// see https://github.com/WICG/navigation-api#appendix-types-of-navigations

// The Navigation API (https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
// offers to listen every type of navigation and react to it

// This is perfect... but it is not well supported: https://caniuse.com/mdn-api_navigation
// (Firefox and Safari missing)

// We don't need for all the Navigation API, just the "listening" part

// There are many approach to listen navigation start:

// - use the Navigation API when available

// - use the URL hash to store the part we want to listen and rely on hashchange event (https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)
// That's what first JS framework SPA did

// - listen to all user action event that can trigger a navigation and prevent them before executing our code: https://stackoverflow.com/a/64232458

export const NAVIGATION_START_EVENT = 'navigation-start'

// TODO ACY pas utilisé pour le moment, ca correspond à la moitié de pjax.mjs, la partie qui écoute la navigation
// l'autre partie de pjax est la partie qui met à jour l'affichage

/**
 * @param {(url: string, replace: boolean) => boolean} callback
 */
export const addNavigationStartEventListener = (callback) => {
  window.addEventListener(NAVIGATION_START_EVENT, (event) => {
    const customEvent = /** @type {CustomEvent} */ (event)
    const url = customEvent.detail.url
    const replace = customEvent.detail.replace
    const result = callback(url, replace)
    if (!result) {
      event.preventDefault()
    }
    return result
  })
}

window.addEventListener('DOMContentLoaded', listenNavigationStart)

function listenNavigationStart() {
  //TODO ACY utiliser Navigation API si disponible
  listenClickOnLinks(onNavigationStart)
  listenPopstateEvents(onNavigationStart)
  listenFormSubmit(onNavigationStart)
}

/**
 * @param {string} url
 * @param {boolean} replace
 */ function onNavigationStart(url, replace) {
  const result = window.document.dispatchEvent(
    new CustomEvent(NAVIGATION_START_EVENT, {
      cancelable: true,
      bubbles: true,
      detail: {
        url,
        replace,
      },
    })
  )
  return result
}

/**
 * @param {(url: string, replace: boolean) => unknown} callback
 */
function listenClickOnLinks(callback) {
  // Inspired by old npm package "catch-links"
  // https://unpkg.com/browse/catch-links/index.js
  window.addEventListener('click', (event) => {
    // Ignore special cases
    {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) {
        return true
      }
    }

    // Find link
    /** @type {HTMLAnchorElement | null}*/
    let anchor = null
    {
      /** @type {Node | null}*/
      let node
      for (node = /** @type {Node?}*/ (event.target); node?.parentNode; node = node.parentNode) {
        if (node.nodeName === 'A') {
          anchor = /** @type {HTMLAnchorElement}*/ (node)
          break
        }
      }
    }

    if (!anchor) {
      return true
    }

    if (anchor.download) {
      return true
    }

    const href = anchor.href

    if (!href) {
      return true
    }

    const target = anchor.target
    if (target === '_blank') {
      return true
    }

    const url = new URL(href)
    if (url.host && url.host !== window.location.host) {
      return true
    }

    const result = callback(href, false)
    if (!result) {
      event.preventDefault()
    }

    return result
  })
}

/**
 * @param {(url: string, replace: boolean) => unknown} callback
 */
function listenPopstateEvents(callback) {
  window.addEventListener('popstate', () => {
    const href = window.location.href
    return callback(href, false)
  })
}

/**
 * @param {(url: string, replace: boolean) => unknown} callback
 */
function listenFormSubmit(callback) {
  window.addEventListener(
    'submit',
    (event) => {
      const form = /** @type {HTMLFormElement}*/ (event.target)

      // Ignore form with method other than GET
      const method = form.getAttribute('method') || form.method
      if (method.toUpperCase() !== 'GET') {
        return true
      }

      // FIXME ignorer aussi les form avec onsubmit déclaré et commencant par javascript: ???

      // Ignore form with no specified action
      if (!form.getAttribute('action')) {
        return true
      }

      const action = form.action

      const parsedURL = new URL(action)
      const formData = new FormData(form)
      // @ts-ignore haven't found a better way to convert FormData to URLSearchParams
      const queryParams = new URLSearchParams(formData)
      parsedURL.search = queryParams.toString()
      const href = parsedURL.href

      event.preventDefault()

      return callback(href, false)
    },
    true /* useCapture */
  )
}
