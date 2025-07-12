import { getApplication } from '../main.mjs'
import { HTML_ACTION_EVENT, htmlAction } from '../shared/html-action/html-action.mjs'
import html from '../shared/html/html-tag.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-search', this)
  }

  app = getApplication()

  /**
   * @param {Event} event
   */
  searchInRecords = (event) => {
    this.app.searchInRecords(event.target ? /** @type {HTMLInputElement} */ (event.target).value : '')
  }

  connectedCallback() {
    this.app.$currentSearch.onChange(() => {
      const input = this.querySelector('input')

      if (input && input === document.activeElement) {
        // Input has the focus, don't refresh it
      } else {
        this.render()
      }
    })

    this.render()
  }

  render = () => {
    const currentSearch = this.app.$currentSearch.get()

    this.innerHTML = html`
      <label class="search" data-accesskey="/">
        <svg class="icon search-icon">
          <use href="#search-symbol" />
        </svg>
        <input
          oninput="${htmlAction(this).searchInRecords(HTML_ACTION_EVENT)}"
          value="${currentSearch}"
          type="search"
          placeholder="Search..."
          ${currentSearch ? `autofocus="${currentSearch}"` : ''}
        />
        <kbd>
          <strong>⌘</strong>
        </kbd>
        <kbd>K</kbd>
      </label>
    `
  }
}
