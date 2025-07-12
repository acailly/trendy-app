import { getApplication } from '../main.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'
import html from '../shared/html/html-tag.mjs'
import UIConfig from '../ui-config.mjs'

/** @typedef {import('../../model/types.mjs').RecordSortAttribute} RecordSortAttribute */

export default class extends HTMLElement {
  static {
    customElements.define('records-sort-buttons', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$sortOrder.onChange(this.render)
    this.app.$sortedRecordAttribute.onChange(this.render)

    this.render()
  }

  /**
   * @param {RecordSortAttribute} sortAttribute
   * @returns {boolean}
   */
  isSorted = (sortAttribute) => {
    const sortedRecordAttribute = this.app.$sortedRecordAttribute.get()
    return sortedRecordAttribute === sortAttribute
  }

  /**
   * @param {RecordSortAttribute} sortAttribute
   */
  sort = (sortAttribute) => {
    const sortOrder = this.app.$sortOrder.get()
    const nextSortOrder = this.isSorted(sortAttribute) ? (sortOrder === 'ASC' ? 'DESC' : 'ASC') : 'DESC'
    this.app.sortRecords(sortAttribute, nextSortOrder)
  }

  render = () => {
    this.innerHTML = html`
      <nav class="flex">
        ${Object.keys(UIConfig.SORT_BUTTON_BY_SORT_ATTRIBUTE)
          .map((key) => {
            const sortAttribute = /** @type {RecordSortAttribute} */ (key)
            return this.renderButton(sortAttribute)
          })
          .join('\n')}
      </nav>
    `
  }

  /**
   * @param {RecordSortAttribute} sortAttribute
   * @returns {string}
   */
  renderButton = (sortAttribute) => {
    const sortOrder = this.app.$sortOrder.get()
    const isSorted = this.isSorted(sortAttribute)

    const label = UIConfig.SORT_BUTTON_BY_SORT_ATTRIBUTE[sortAttribute].label
    const icon = isSorted ? (sortOrder === 'ASC' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'

    return html`<button
      class="button-plain"
      onclick="${htmlAction(this).sort(sortAttribute)}"
      ${isSorted ? 'aria-pressed' : ''}
      title="Sort by ${label.toLowerCase()}"
    >
      ${label}
      <svg class="button-icon icon ${icon}-icon">
        <use href="#${icon}-symbol" />
      </svg>
    </button>`
  }
}
