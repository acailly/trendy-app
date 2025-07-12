import html from '../shared/html/html-tag.mjs'
import { getApplication } from '../main.mjs'
import UIConfig from '../ui-config.mjs'
import './records-user.component.mjs'
import { buildUpdateSearchParamsLink, listenAnySearchParamChange } from '../shared/search-params/search-params.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-nav-panel-categories', this)
  }

  app = getApplication()

  connectedCallback() {
    listenAnySearchParamChange(this.render)

    this.render()
  }

  render = () => {
    const currentRecordCategory = this.app.$recordCategory.get()

    this.innerHTML = html`
      <nav>
        ${Object.entries(UIConfig.VIEWS_BY_RECORD_TYPE)
          .map(
            ([recordCategory, view], viewIndex) => html`
              <a
                href="${buildUpdateSearchParamsLink(view.searchParams)}"
                data-accesskey="${viewIndex + 1}"
                title="${view.title}"
                ${recordCategory === currentRecordCategory ? 'aria-current="page"' : ''}
              >
                <svg class="icon ${view.icon}-icon icon-highlight-when-current">
                  <use href="#${view.icon}-symbol" />
                </svg>

                ${view.title}</a
              >
            `
          )
          .join('\n')}
      </nav>

      <details name="plans" open>
        <summary>Plans</summary>
        <nav>
          ${Object.entries(UIConfig.VIEWS_BY_PLAN)
            .map(
              ([recordCategory, view]) => html`
                <a
                  href="${buildUpdateSearchParamsLink(view.searchParams)}"
                  ${recordCategory === currentRecordCategory ? 'aria-current="page"' : ''}
                >
                  <svg class="icon dot-icon ${view.cssClass}">
                    <use href="#dot-symbol" />
                  </svg>
                  ${view.label}
                </a>
              `
            )
            .join('\n')}
        </nav>
      </details>

      <details name="sizes" open>
        <summary>Company size</summary>
        <nav>
          ${Object.entries(UIConfig.VIEWS_BY_COMPANY_SIZE)
            .map(
              ([recordCategory, view]) => html`
                <a
                  href="${buildUpdateSearchParamsLink(view.searchParams)}"
                  ${recordCategory === currentRecordCategory ? 'aria-current="page"' : ''}
                >
                  <svg class="icon square-icon ${view.cssClass}">
                    <use href="#square-symbol" />
                  </svg>
                  ${view.label}
                </a>
              `
            )
            .join('\n')}
        </nav>
      </details>
    `
  }
}
