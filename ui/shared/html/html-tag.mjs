/**
 * @param {TemplateStringsArray} texts
 * @param  {...any} vars
 * @returns {string}
 */
function html(texts, ...vars) {
  let result = texts[0]

  for (let textIndex = 1; textIndex < texts.length; textIndex++) {
    result += vars[textIndex - 1]
    result += texts[textIndex]
  }

  return result
}

// TODO ACY ajouter le sanitize (regarder comment font les frameworks ???)
// TODO ACY regarder de ce côté https://plainvanillaweb.com/pages/applications.html#entity-encoding

// TODO ACY regarder proposition d'integrer ca au standard
// https://justinfagnani.com/2025/06/26/the-time-is-right-for-a-dom-templating-api/
// https://github.com/WICG/webcomponents/issues/1069

export default html
