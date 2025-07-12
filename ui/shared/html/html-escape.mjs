/**
 * Class used to mark string as already escaped
 */
export class EscapedHTML extends String {}

/**
 * @type {Record<string, string>}
 */
const ESCAPE_HTML_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}

/**
 * Escape special characters to avoid some XSS attacks
 *
 * Inspired from https://plainvanillaweb.com/pages/applications.html#entity-encoding
 * Inspired from https://stackoverflow.com/a/57448862/20980
 * Inspired from https://github.com/jsebrech/html-literal/tree/main
 *
 * @param {unknown} value
 * @returns {EscapedHTML}
 */
export const escapeHTML = (value) =>
  value instanceof EscapedHTML
    ? value
    : new EscapedHTML(String(value).replace(/[&<>'"]/g, (matching) => ESCAPE_HTML_MAP[matching] ?? matching))

// TODO ACY Ca marche pas de l'inclure dans le tag html directement
//
// html`
//   <ul>
//     ${tutu.map((v) => html` <li>${v}</li> `).join('\n')}
//   </ul>
// `
//
// même si chaque élément du map est marqué comme déjà escaped car issu d'un appel à html,
// le fait de concatener le tout par un join fait que la concatenation ne sera plus marquée comme escaped et sera
// à nouveau escaped
//
// ... c'est dommage car ca aurait rendu le truc automatique et donc plus sûr
// en attendant il faut explicitement faire un escapeHTML() là où c'est propice à des failles XSS
