import { getApplication } from '../main.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'
import html from '../shared/html/html-tag.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-media-thumbs', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$visibleRecordDetailsImage.onChange(this.render)

    this.render()
  }

  /**
   * @param {number} imageIndex
   */
  openRecordDetailsImage = (imageIndex) => {
    this.app.openRecordDetailsImage(imageIndex)
  }

  render = () => {
    const record = this.app.$visibleRecordDetails.get()
    if (!record) {
      return
    }

    this.innerHTML = html`
      <ul class="media-thumbs">
        ${record.imageUrls
          .map((imageUrl, imageIndex) => {
            return html`
              <li>
                <button onclick="${htmlAction(this).openRecordDetailsImage(imageIndex)}">
                  <img src="${imageUrl}" />
                </button>
              </li>
            `
          })
          .join('\n')}
      </ul>
    `
  }
}
