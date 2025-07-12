import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import UIConfig from '../ui-config.mjs'
import './records-user.component.mjs'
import './records-chat-thread.component.mjs'
import './records-media-thumbs.component.mjs'
import './records-media-overlay.component.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-details', this)
  }

  app = getApplication()

  connectedCallback() {
    this.render()
  }

  render = () => {
    const record = this.app.$visibleRecordDetails.get()
    if (!record) {
      return
    }

    const companySizeDescription = record.companySize
      ? UIConfig.VIEWS_BY_COMPANY_SIZE[record.companySize].description
      : ''

    this.innerHTML = html`
      <section class="user">
        <records-user image="${record.iconUrl}" title="${record.authorFullName}"> ${record.authorEmail} </records-user>

        ${record.companyName
          ? html`
              <dl class="property-list">
                <dt>Company</dt>
                <dd>${record.companyName}</dd>
                <dt>Country</dt>
                <dd>${record.companyCountry}</dd>
                <dt>Company size</dt>
                <dd>${companySizeDescription} (${record.companySize})</dd>
                <dt>Website</dt>
                <dd><a class="action">${record.companyWebsite}</a></dd>
                <dt>Plan</dt>
                <dd>
                  <span class="pill">
                    <svg class="pill-icon icon dot-icon">
                      <use href="#dot-symbol" />
                    </svg>
                    ${record.plan}
                  </span>
                </dd>
              </dl>
            `
          : ''}

        <!-- TODO ACY tout clignotte quand on clique sur une miniature pour l'afficher, et quand on passe d'une miniature à une autre -->
        <records-media-thumbs></records-media-thumbs>
        <records-media-overlay></records-media-overlay>
        <records-chat-thread></records-chat-thread>
      </section>
    `
  }
}
