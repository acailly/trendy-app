import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import './records-media-thumbs.component.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-media-overlay', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$visibleRecordDetailsImage.onChange(this.render)

    this.render()
  }

  render = () => {
    const record = this.app.$visibleRecordDetails.get()
    if (!record) {
      return
    }

    const imageIndex = this.app.$visibleRecordDetailsImage.get()
    if (imageIndex === null || imageIndex === undefined) {
      return
    }

    this.innerHTML = html`
      <dialog class="media-overlay" popover id="media">
        <header>
          <h2>Screenshots</h2>
          <button class="button-ghost" popovertarget="media">
            <svg class="button-icon icon x-icon">
              <use href="#x-symbol" />
            </svg>
          </button>
        </header>

        <figure>
          <img src="${record.imageUrls[imageIndex]}" />
        </figure>

        <aside>
          <records-media-thumbs></records-media-thumbs>
        </aside>
      </dialog>
    `

    const dialog = /** @type {HTMLElement | null} */ (this.querySelector('#media')) // TODO ACY on peut utiliser ca a la place : https://gomakethings.com/your-browser-automatically-creates-javascript-variables-for-elements-with-an-id/
    if (dialog && !dialog.checkVisibility()) {
      /**
       * @param {Event} event
       */
      let handler = (event) => {
        const toggleEvent = /** @type {ToggleEvent} */ (event)
        if (toggleEvent.newState === 'closed') {
          dialog.removeEventListener('toggle', handler)
          this.app.closeRecordDetailsImages()
        }
      }
      dialog.addEventListener('toggle', handler)

      dialog.showPopover()
    }
  }
}
