import { getApplication } from '../main.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'
import html from '../shared/html/html-tag.mjs'
import UIConfig from '../ui-config.mjs'
import './records-collection.component.mjs'

/** @typedef {import("../../model/types.mjs").RecordType} RecordType */
/** @typedef {import("../../model/types.mjs").PlanType} PlanType */
/** @typedef {import("../../model/types.mjs").CompanySize} CompanySize */

export default class extends HTMLElement {
  static {
    customElements.define('records-content-panel', this)
  }

  app = getApplication()

  getTitle = () => {
    const currentRecordCategory = this.app.$recordCategory.get()

    const planType = UIConfig.VIEWS_BY_PLAN[/** @type{PlanType} */ (currentRecordCategory)]
    if (planType) {
      return `${planType.label} plans`
    }

    const companySize = UIConfig.VIEWS_BY_COMPANY_SIZE[/** @type{CompanySize} */ (currentRecordCategory)]
    if (companySize) {
      return `${companySize.label} companies`
    }

    const recordTypeView = UIConfig.VIEWS_BY_RECORD_TYPE[/** @type{RecordType} */ (currentRecordCategory)]
    if (recordTypeView) {
      return recordTypeView.title
    }

    return 'All contacts'
  }

  getPaginationStatus = () => {
    const pagination = this.app.$pagination.get()
    const start = pagination.pageIndex * pagination.pageSize
    const end = (pagination.pageIndex + 1) * pagination.pageSize
    const total = this.app.$visibleRecordCount.get()

    return `${start + 1} – ${end} of ${total}`
  }

  connectedCallback() {
    this.app.$visibleRecordCount.onChange(this.render)
    this.app.$pagination.onChange(this.render)
    this.app.$recordsDisplayLayout.onChange(this.render)

    this.render()
  }

  nextPage = () => {
    this.app.nextPage()
  }

  previousPage = () => {
    this.app.previousPage()
  }

  displayInGrid = () => {
    this.app.changeRecordsDisplayLayout('GRID')
  }

  displayInList = () => {
    this.app.changeRecordsDisplayLayout('LIST')
  }

  openNavigationPanel = () => {
    this.app.toggleNavigationPanel(true)
  }

  render = () => {
    const title = this.getTitle()
    const paginationStatus = this.getPaginationStatus()
    const recordDisplayLayout = this.app.$recordsDisplayLayout.get()
    const isNextPageAvailable = this.app.isNextPageAvailable()
    const isPreviousPageAvailable = this.app.isPreviousPageAvailable()

    this.innerHTML = html`
      <div class="panel">
        <header>
          <button class="button-ghost mobile" onclick="${htmlAction(this).openNavigationPanel()}">
            <svg class="button-icon icon panel-left-icon">
              <use href="#panel-left-symbol" />
            </svg>
          </button>

          <h2 onclick="${htmlAction(this).openNavigationPanel()}">${title}</h2>

          <nav>
            <small>${paginationStatus}</small>

            <button
              class="button-ghost"
              onclick="${htmlAction(this).previousPage()}"
              data-accesskey="ArrowLeft h"
              ${isPreviousPageAvailable ? '' : 'disabled'}
              title="Previous page"
            >
              <svg class="button-icon icon chevron-left-icon">
                <use href="#chevron-left-symbol" />
              </svg>
            </button>

            <button
              class="button-ghost"
              onclick="${htmlAction(this).nextPage()}"
              data-accesskey="ArrowRight l"
              ${isNextPageAvailable ? '' : 'disabled'}
              title="Next page"
            >
              <svg class="button-icon icon chevron-right-icon">
                <use href="#chevron-right-symbol" />
              </svg>
            </button>

            <hr />

            <button
              class="button-ghost"
              onclick="${htmlAction(this).displayInList()}"
              data-accesskey="g"
              ${recordDisplayLayout === 'LIST' ? 'aria-pressed' : ''}
              title="Toggle table view"
            >
              <svg class="button-icon icon list-icon">
                <use href="#list-symbol" />
              </svg>
            </button>

            <button
              class="button-ghost"
              onclick="${htmlAction(this).displayInGrid()}"
              data-accesskey="g"
              ${recordDisplayLayout === 'GRID' ? 'aria-pressed' : ''}
              title="Toggle grid view"
            >
              <svg class="button-icon icon grid-icon">
                <use href="#grid-symbol" />
              </svg>
            </button>

            <hr />

            <button class="button-ghost" popovertarget="help" data-accesskey="?" title="Show keyboard shortcuts">
              <svg class="button-icon icon question-icon">
                <use href="#question-symbol" />
              </svg>
            </button>
          </nav>
        </header>

        <section id="main_wrap">
          <records-collection></records-collection>
        </section>

        <dialog class="ui" id="help" popover>
          <header class="flex">
            <h2>Keyboard shortcuts</h2>
            <button class="button-ghost" popovertarget="help">
              <svg class="button-icon icon x-icon">
                <use href="#x-symbol" />
              </svg>
            </button>
          </header>

          <dl class="property-list full-size">
            <dt>Previous page</dt>
            <dd><kbd>h</kbd></dd>
            <dt>Next page</dt>
            <dd><kbd>l</kbd></dd>
            <dt>Previous entry</dt>
            <dd><kbd>j</kbd></dd>
            <dt>Next entry</dt>
            <dd><kbd>k</kbd></dd>
            <dt>Toggle grid view</dt>
            <dd><kbd>g</kbd></dd>
            <dt>Focus search</dt>
            <dd><kbd>/</kbd></dd>
          </dl>
        </dialog>
      </div>
    `
  }
}
