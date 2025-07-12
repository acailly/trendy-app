import { getApplication } from '../main.mjs'
import html from '../shared/html/html-tag.mjs'
import './records-item.component.mjs'
import './records-sort-buttons.component.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-collection', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$recordsDisplayLayout.onChange(this.render)
    this.app.$visibleRecords.onChange(this.render)

    this.render()
  }

  render = () => {
    const recordDisplayLayout = this.app.$recordsDisplayLayout.get()
    const visibleRecords = this.app.$visibleRecords.get()

    this.innerHTML = html`
      <section>
        <header class="subheader">
          <records-sort-buttons />
        </header>

        <ul class="collection ${recordDisplayLayout === 'GRID' ? 'collection-grid' : 'collection-table'}">
          ${visibleRecords
            .map(
              (visibleRecord, visibleRecordIndex) =>
                html`<li>
                  <records-item
                    record-id="${visibleRecord.id}"
                    class="appears"
                    style="--delay: ${visibleRecordIndex}"
                  />
                </li>`
            )
            .join('\n')}
          ${!visibleRecords.length ? html`<li>No records found</li>` : ''}
        </ul>
      </section>
    `
  }
}
