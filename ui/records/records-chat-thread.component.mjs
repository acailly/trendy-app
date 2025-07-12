import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import './records-time.component.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-chat-thread', this)
  }

  app = getApplication()

  connectedCallback() {
    this.render()
  }

  /**
   *
   * @param {string} text
   * @returns {boolean}
   */
  isEmoji = (text) => {
    // @ts-ignore TODO ACY essayer de corriger ce message d'erreur
    return !text[3] && /\p{Emoji}/u.test(text)
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  formatMessageContent(text) {
    return text
      .split('\n')
      .map((p) => `<p>${p}</p>`)
      .join('')
  }

  render = () => {
    const record = this.app.$visibleRecordDetails.get()
    if (!record) {
      return
    }

    this.innerHTML = html`
      <!-- discussion thread -->
      <ul class="chat-thread">
        ${record.discussion
          .map(
            (message) => html`
              <li class="${message.isReply ? 'chat-reply' : ''} appears">
                ${message.creationDate
                  ? html`<records-time timestamp="${message.creationDate.getTime()}"></records-time>`
                  : ''}
                <div class="${this.isEmoji(message.content) ? 'emoji' : 'chat-post'}">
                  ${this.formatMessageContent(message.content)}
                </div>
              </li>
            `
          )
          .join('\n')}
      </ul>
    `
  }
}
