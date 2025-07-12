import html from '../shared/html/html-tag.mjs'

export default class RecordsTimeComponent extends HTMLElement {
  static {
    customElements.define('records-time', this)
  }

  static TODAY = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
  static THIS_YEAR = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  static OLDER = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  /**
   * @param {number} timestamp
   * @returns {string}
   */
  formatDate = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)

    return date.toDateString() === now.toDateString()
      ? RecordsTimeComponent.TODAY.format(date)
      : date.getFullYear() === now.getFullYear()
        ? RecordsTimeComponent.THIS_YEAR.format(date)
        : RecordsTimeComponent.OLDER.format(date)
  }

  connectedCallback() {
    const timestamp = this.getAttribute('timestamp')
    if (!timestamp) {
      return
    }

    const timestampAsNumber = Number.parseInt(timestamp, 10)
    if (Number.isNaN(timestampAsNumber)) {
      return
    }

    this.innerHTML = html`<time>${this.formatDate(timestampAsNumber)}</time>`
  }
}
