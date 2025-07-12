import html from '../shared/html/html-tag.mjs'
import { getApplication } from '../main.mjs'
import './records-user.component.mjs'
import './records-nav-panel-categories.component.mjs'
import './records-search.component.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('records-nav-panel', this)
  }

  app = getApplication()

  connectedCallback() {
    this.app.$isNavigationPanelOpen.onChange(this.render)

    // TODO ACY simulate login while real login isn't working
    this.app.login('demo.user@example.com', 'password')

    this.render()
  }

  logout = () => {
    this.app.logout()
    // TODO ACY naviguer direct vers la bonne page ?
    window.location.reload()
  }

  toggleNavigationPanel = () => {
    this.app.toggleNavigationPanel(false)
  }

  render = () => {
    const open = this.app.$isNavigationPanelOpen.get()

    this.innerHTML = html`
      <aside class="panel nav-panel" ${open ? 'aria-visible="true"' : ''}>
        <header>
          <img src="../assets/img/logomark.webp" width="60" height="23" />
          <button
            class="button-ghost mobile"
            data-accesskey="Escape"
            title="Close"
            onclick="${htmlAction(this).toggleNavigationPanel()}"
          >
            <svg class="button-icon icon x-icon">
              <use href="#x-symbol" />
            </svg>
          </button>
        </header>

        <section>
          <records-search></records-search>
          <records-nav-panel-categories></records-nav-panel-categories>
        </section>

        <footer>
          <records-user title="${this.app.$myFullName.get()}" image="${this.app.$myAvatarUrl.get()}">
            <a class="action" onclick="${htmlAction(this).logout()}">Logout</a>
          </records-user>
        </footer>
      </aside>
    `
  }
}
