import { synchronizeAWithB } from '../synchronize/synchronize-a-with-b.mjs'

/**
 * @param {Storage} storage
 * @param {string} key
 * @returns {string | null}
 */
export const getWebStorageValue = (storage, key) => {
  return storage.getItem(key)
}

/**
 * @param {string} key
 * @returns {string | null}
 */
export const getLocalStorageValue = (key) => {
  return getWebStorageValue(localStorage, key)
}

/**
 * @param {string} key
 * @returns {string | null}
 */
export const getSessionStorageValue = (key) => {
  return getWebStorageValue(sessionStorage, key)
}

/**
 * @param {Storage} storage
 * @param {string} key
 * @param {string | null} value
 */
export const setWebStorageValue = (storage, key, value) => {
  if (value) {
    storage.setItem(key, value)
  } else {
    storage.removeItem(key)
  }
}

/**
 * @param {string} key
 * @param {string | null} value
 */
export const setLocalStorageValue = (key, value) => {
  setWebStorageValue(localStorage, key, value)
}

/**
 * @param {string} key
 * @param {string | null} value
 */
export const setSessionStorageValue = (key, value) => {
  setWebStorageValue(sessionStorage, key, value)
}

/**
 * @param {Storage} storage
 * @param {string} key
 * @param {(previousValue: string|null, currentValue: string|null) => unknown} callback
 */
export const listenWebStorageChange = (storage, key, callback) => {
  addEventListener('storage', (event) => {
    const { key: eventKey, oldValue, newValue, storageArea } = event
    if (key === eventKey && storageArea === storage) {
      const hasChanged = oldValue !== newValue
      if (hasChanged) {
        callback(oldValue, newValue)
      }
    }
  })
}

/**
 * @param {string} key
 * @param {(previousValue: string|null, currentValue: string|null) => unknown} callback
 */
export const listenLocaleStorageChange = (key, callback) => {
  listenWebStorageChange(localStorage, key, callback)
}

/**
 * @param {string} key
 * @param {(previousValue: string|null, currentValue: string|null) => unknown} callback
 */
export const listenSessionStorageChange = (key, callback) => {
  listenWebStorageChange(sessionStorage, key, callback)
}

/**
 * @param {Storage} storage
 * @param {string} key
 * @param {() => string | null} getValueFromExternal
 * @param {(searchParamsValue: string|null) => void} updateExternal
 * @param {(updateSearchParam: (newValue: string | null) => void) => void} listenExternalChange
 */
export const synchronizeWebStorageWithExternal = (
  storage,
  key,
  getValueFromExternal,
  updateExternal,
  listenExternalChange
) => {
  return synchronizeAWithB(
    // getAValue
    () => getWebStorageValue(storage, key),
    // setAValueFromB
    (value) => setWebStorageValue(storage, key, value),
    // getBValue
    getValueFromExternal,
    // setBValueFromA
    updateExternal,
    // listenAChange
    (updateExternal) => {
      listenWebStorageChange(storage, key, (_, currentSearchParamValue) => {
        updateExternal(currentSearchParamValue)
      })
    },
    // listenBChange
    listenExternalChange
  )
}

/**
 * @param {string} key
 * @param {() => string | null} getValueFromExternal
 * @param {(searchParamsValue: string|null) => void} updateExternal
 * @param {(updateSearchParam: (newValue: string | null) => void) => void} listenExternalChange
 */
export const synchronizeLocalStorageWithExternal = (
  key,
  getValueFromExternal,
  updateExternal,
  listenExternalChange
) => {
  return synchronizeWebStorageWithExternal(
    localStorage,
    key,
    getValueFromExternal,
    updateExternal,
    listenExternalChange
  )
}

/**
 * @param {string} key
 * @param {() => string | null} getValueFromExternal
 * @param {(searchParamsValue: string|null) => void} updateExternal
 * @param {(updateSearchParam: (newValue: string | null) => void) => void} listenExternalChange
 */
export const synchronizeSessionStorageWithExternal = (
  key,
  getValueFromExternal,
  updateExternal,
  listenExternalChange
) => {
  return synchronizeWebStorageWithExternal(
    sessionStorage,
    key,
    getValueFromExternal,
    updateExternal,
    listenExternalChange
  )
}
