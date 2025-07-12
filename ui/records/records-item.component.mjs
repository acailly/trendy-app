import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import { buildUpdateSearchParamsLink } from '../shared/search-params/search-params.mjs'
import UIConfig, { SEARCH_PARAM_RECORD_DETAILS_ID } from '../ui-config.mjs'
import './records-user.component.mjs'
import './records-time.component.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-item', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$visibleRecordDetails.onChange(({ previousValue, currentValue }) => {
      const recordId = this.getAttribute('record-id')
      if (recordId === previousValue?.id || recordId === currentValue?.id) {
        this.render()
      }
    })

    this.render()
  }

  render = () => {
    const recordId = this.getAttribute('record-id')
    if (!recordId) {
      return
    }

    const record = this.app.getRecordDetailsFromId(recordId)
    if (!record) {
      return
    }

    /** @type {Parameters<typeof buildUpdateSearchParamsLink>[0]} */
    const linkSearchParams = {
      [SEARCH_PARAM_RECORD_DETAILS_ID]: record.id,
    }

    const currentRecordDetails = this.app.$visibleRecordDetails.get()
    const isSelected = currentRecordDetails?.id === record.id

    this.innerHTML = html`
      <a
        href="${buildUpdateSearchParamsLink(linkSearchParams)}"
        class="collection-item appears"
        ${isSelected ? 'aria-selected="true"' : ''}
      >
        <aside>
          <small class="">
            <svg class="icon ${record.typeIcon}-icon">
              <use href="#${record.typeIcon}-symbol" />
            </svg>
            ${record.type?.replace('_', ' ').toLowerCase()}
          </small>
          <records-time timestamp="${record.creationDate.getTime()}" style="display: contents;"></records-time>
        </aside>

        <records-user image="${record.iconUrl}" title="${this.searchHilight(record.authorFullName)}" width="32">
          ${this.searchHilight(record.authorEmail)}
        </records-user>

        <div class="meta">
          ${record.companySize
            ? html`<span class="pill">
                <svg class="pill-icon icon dot-icon ${UIConfig.VIEWS_BY_COMPANY_SIZE[record.companySize].cssClass}">
                  <use href="#dot-symbol" />
                </svg>
                ${UIConfig.VIEWS_BY_COMPANY_SIZE[record.companySize].label}
              </span>`
            : ''}
          ${record.plan
            ? html`<span class="pill">
                <svg class="pill-icon icon square-icon ${UIConfig.VIEWS_BY_PLAN[record.plan].cssClass}">
                  <use href="#square-symbol" />
                </svg>
                ${UIConfig.VIEWS_BY_PLAN[record.plan].label}
              </span>`
            : ''}
          ${record.imageCount > 0
            ? html`<span class="pill pill-plain">
                <svg class="pill-icon icon image-icon">
                  <use href="#image-symbol" />
                </svg>
                ${record.imageCount}
              </span>`
            : ''}
        </div>

        <blockquote>${this.searchHilight(record.description)}</blockquote>
      </a>
    `
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  searchHilight = (text) => {
    const currentSearch = this.app.$currentSearch.get()
    const currentSearchRegex = new RegExp(`(${currentSearch})`, 'gi')
    return text.replace(currentSearchRegex, '<mark>$1</mark>')
  }
}
