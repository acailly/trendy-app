import { getApplication } from '../main.mjs'
import { HTML_ACTION_EVENT, htmlAction } from '../shared/html-action/html-action.mjs'
import html from '../shared/html/html-tag.mjs'
import './records-time.component.mjs'

/** @typedef {import('../../model/types.mjs').RecordDetails} RecordDetails */

export default class extends HTMLElement {
  static {
    customElements.define('records-chat-form', this)
  }

  app = getApplication()

  /**
   *
   * @param {RecordDetails['id']} recordId
   * @param {Event} event
   */
  onKeydown(recordId, event) {
    const keyboardEvent = /** @type {KeyboardEvent} */ (event)
    if (keyboardEvent.key == 'Enter' && (keyboardEvent.metaKey || keyboardEvent.ctrlKey)) {
      event.preventDefault()
      this.submit(recordId)
    }
  }

  /**
   *
   * @param {RecordDetails['id']} recordId
   */
  submit = (recordId) => {
    const form = /** @type {HTMLFormElement | null} */ (this.querySelector('form'))
    if (form) {
      const data = new FormData(form)

      const message = data.get('message')?.toString()

      if (message?.trim()) {
        this.app.answerRecordConversation(recordId, message)

        // TODO ACY ca serait plus clean de pas avoir de dépendance de ce style inter composants non ???
        const messageList = window.document.querySelector('#details_body')
        if (messageList) {
          messageList.scrollTop = 100000
        }

        // @ts-ignore TODO ACY faire marcher la verif de type la dessus
        form.elements['message'].value = ''
      }
    }
  }

  connectedCallback() {
    this.render()
  }

  render = () => {
    const record = this.app.$visibleRecordDetails.get()
    if (!record) {
      return
    }

    this.innerHTML = html`
      <form class="chat-form appears" onsubmit="${htmlAction(this).submit(record.id)}">
        <textarea
          name="message"
          onkeydown="${htmlAction(this).onKeydown(record.id, HTML_ACTION_EVENT)}"
          placeholder="Type your reply..."
          required
        ></textarea>
        <button class="button-primary">
          <svg class="button-icon icon send-horizontal-icon">
            <use href="#send-horizontal-symbol" />
          </svg>
        </button>
      </form>
    `
  }
}
