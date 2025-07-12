// The Navigation API (https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)
// offers to listen every type of navigation and react to it

// This is perfect... but it is not well supported: https://caniuse.com/mdn-api_navigation
// (Firefox and Safari missing)

// We don't need for all the Navigation API, just the "listening" part

// There are many approach to listen navigation end:

// - make the app always use history.pushState/replaceState and monkey patch these methods
// That's what wouter does for example: https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-browser-location.js

// - set a timeout to continuously check if the URL has changed: https://stackoverflow.com/a/36438922

export const NAVIGATION_END_EVENT = 'navigation-end'

/**
 * @param {(previousUrl: string | null, currentUrl: string) => unknown} callback
 */
export const addNavigationEndEventListener = (callback) => {
  window.addEventListener(NAVIGATION_END_EVENT, (event) => {
    const customEvent = /** @type {CustomEvent} */ (event)
    const previousUrl = customEvent.detail.previousUrl
    const currentUrl = customEvent.detail.currentUrl
    callback(previousUrl, currentUrl)
  })
}

window.addEventListener('DOMContentLoaded', listenNavigationEnd)

function listenNavigationEnd() {
  // The first load occurs after a navigation, so we trigger the callback
  onNavigationEnd(null, window.location.href)

  //TODO ACY utiliser Navigation API si disponible

  listenHistoryPushOrReplaceState(onNavigationEnd)
  // TODO ACY vérifier que ca marche pour les navigations avec le bouton precedent/suivant (popstate)
  // ou s'il y a besoin de l'écouter aussi ?
}

/**
 * @param {string | null} previousUrl
 * @param {string} currentUrl
 */ async function onNavigationEnd(previousUrl, currentUrl) {
  window.document.dispatchEvent(
    new CustomEvent(NAVIGATION_END_EVENT, {
      cancelable: false,
      bubbles: true,
      detail: {
        previousUrl,
        currentUrl,
      },
    })
  )
}

/**
 * @param {(previousUrl: string | null, currentUrl: string) => unknown} callback
 */
function listenHistoryPushOrReplaceState(callback) {
  // inspired by https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/use-browser-location.js

  listenHistoryMethod('pushState', callback)
  listenHistoryMethod('replaceState', callback)
}

const HISTORY_ALREADY_PATCHED_KEY = 'HISTORY_ALREADY_PATCHED_KEY'

/**
 * @param {string} methodName
 * @param {(previousUrl: string | null, currentUrl: string) => unknown} callback
 */
function listenHistoryMethod(methodName, callback) {
  // Inspired by https://stackoverflow.com/a/4585031
  if (
    typeof history !== 'undefined' &&
    // @ts-expect-error -- monkey patching
    typeof history[methodName] != 'undefined' &&
    // @ts-expect-error -- monkey patching
    typeof history[methodName][HISTORY_ALREADY_PATCHED_KEY] === 'undefined'
  ) {
    // @ts-expect-error -- monkey patching
    const original = history[methodName]

    const patched = function () {
      const previousUrl = window.location.href

      // @ts-expect-error -- monkey patching
      const result = original.apply(this, arguments)

      const currentUrl = window.location.href

      callback(previousUrl, currentUrl)

      return result
    }

    // patch history object only once
    patched[HISTORY_ALREADY_PATCHED_KEY] = true

    // @ts-expect-error -- monkey patching
    history[methodName] = patched
  }
}
