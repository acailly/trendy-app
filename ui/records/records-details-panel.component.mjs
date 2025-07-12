import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import './records-details.component.mjs'
import './records-chat-form.component.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'

/** @typedef {import("../../model/types.mjs").RecordType} RecordType */
/** @typedef {import("../../model/types.mjs").PlanType} PlanType */
/** @typedef {import("../../model/types.mjs").CompanySize} CompanySize */

// TODO ACY quand on est en mobile, ce panneau doit s'afficher dans une sorte de dialog

export default class extends HTMLElement {
  static {
    customElements.define('records-details-panel', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$visibleRecordDetails.onChange(this.render)

    this.render()
  }

  closeRecordDetails = () => {
    this.app.closeRecordDetails()
  }

  render = () => {
    const currentRecordDetails = this.app.$visibleRecordDetails.get()

    this.hidden = !currentRecordDetails

    this.innerHTML = html`
      <aside class="panel details-panel card">
        <header class="appears" style="--delay: 0">
          <h2>Conversation</h2>
          <nav>
            <button
              class="button-ghost"
              title="Close"
              onclick="${htmlAction(this).closeRecordDetails()}"
              data-accesskey="Esc"
            >
              <!-- dummy for display, real key is named 'Escape' -->
              <svg class="button-icon icon x-icon">
                <use href="#x-symbol" />
              </svg>
            </button>
          </nav>
        </header>

        <section id="details_body" class="appears" style="--delay: 2">
          ${currentRecordDetails ? html` <records-details></records-details> ` : ''}
        </section>

        <footer>
          <div id="details_footer">${currentRecordDetails ? html`<records-chat-form></records-chat-form>` : ''}</div>
        </footer>
      </aside>
    `
  }
}
