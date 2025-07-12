import { addNavigationEndEventListener } from '../navigation-end-listener/navigation-end-listener.mjs'
import { synchronizeAWithB } from '../synchronize/synchronize-a-with-b.mjs'

/**
 * @param {string} searchParamName
 * @returns {string | null}
 */
export const getSearchParam = (searchParamName) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(searchParamName)
}

/**
 * Inspired by https://gomakethings.com/how-to-modify-a-url-without-reloading-the-page-with-vanilla-javascript/
 *
 * @param {string} searchParamName
 * @param {string | null} value
 */
export const setSearchParam = (searchParamName, value) => {
  const newHref = buildUpdateSearchParamsLink({ [searchParamName]: value })
  window.history.pushState({}, '', newHref)
}

/**
 * @param {Record<string, string | null>} newSearchParams
 * @return {string}
 */
export const buildUpdateSearchParamsLink = (newSearchParams) => {
  const newUrl = new URL(window.location.href)

  Object.entries(newSearchParams).forEach(([searchParamName, value]) => {
    if (value) {
      newUrl.searchParams.set(searchParamName, value)
    } else {
      newUrl.searchParams.delete(searchParamName)
    }
  })

  return newUrl.href
}

/**
 * @param {(previousSearchParams: URLSearchParams, currentSearchParams: URLSearchParams) => unknown} callback
 */
export const listenAnySearchParamChange = (callback) => {
  addNavigationEndEventListener((previousUrl, currentUrl) => {
    const previousSearchParams = previousUrl ? new URL(previousUrl).searchParams : new URLSearchParams()
    previousSearchParams.sort()
    const currentSearchParams = new URL(currentUrl).searchParams
    currentSearchParams.sort()

    const hasChanged = previousSearchParams.toString() !== currentSearchParams.toString()
    if (hasChanged) {
      callback(previousSearchParams, currentSearchParams)
    }
  })
}

/**
 * @param {string} searchParam
 * @param {(previousValue: string|null, currentValue: string|null) => unknown} callback
 */
export const listenSearchParamChange = (searchParam, callback) => {
  addNavigationEndEventListener((previousUrl, currentUrl) => {
    const previousSearchParamValue = previousUrl ? new URL(previousUrl).searchParams.get(searchParam) : null
    const currentSearchParamValue = new URL(currentUrl).searchParams.get(searchParam)

    const hasChanged = previousSearchParamValue !== currentSearchParamValue
    if (hasChanged) {
      callback(previousSearchParamValue, currentSearchParamValue)
    }
  })
}

/**
 * @param {string} searchParam
 * @param {() => string | null} getValueFromExternal
 * @param {(searchParamsValue: string|null) => void} updateExternal
 * @param {(updateSearchParam: (newValue: string | null) => void) => void} listenExternalChange
 */
export const synchronizeSearchParamsWithExternal = (
  searchParam,
  getValueFromExternal,
  updateExternal,
  listenExternalChange
) => {
  return synchronizeAWithB(
    // getAValue
    () => getSearchParam(searchParam),
    // setAValueFromB
    (value) => setSearchParam(searchParam, value),
    // getBValue
    getValueFromExternal,
    // setBValueFromA
    updateExternal,
    // listenAChange
    (updateExternal) => {
      listenSearchParamChange(searchParam, (_, currentSearchParamValue) => {
        updateExternal(currentSearchParamValue)
      })
    },
    // listenBChange
    listenExternalChange
  )
}
