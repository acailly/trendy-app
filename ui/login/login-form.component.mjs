import html from '../shared/html/html-tag.mjs'
import { getApplication } from '../main.mjs'
import { htmlAction } from '../shared/html-action/html-action.mjs'

export default class extends HTMLElement {
  static {
    customElements.define('login-form', this)
  }

  app = getApplication()

  login = () => {
    const form = /** @type {HTMLFormElement | null} */ (this.querySelector('form'))
    if (form) {
      const data = new FormData(form)

      const email = data.get('email')?.toString()
      const password = data.get('password')?.toString()

      if (email && password) {
        const app = getApplication()
        app.login(email, password)
        // TODO ACY naviguer direct vers la bonne page ?
        window.location.reload()

        // TODO ACY gérer message erreur si le login a échoué
      }
    }
  }

  connectedCallback() {
    this.innerHTML = html`
      <div>
        <form onsubmit="${htmlAction(this).login()}" class="login ui card" id="login-form">
          <header>
            <img class="logo" src="../assets/img/logo.png" width="40" />
            <h1>Demo Login</h1>
          </header>

          <label>
            <h3>Email</h3>
            <input name="email" type="email" autofocus value="demo.user@example.com" autocomplete="email" />
          </label>

          <label>
            <h3>Password</h3>
            <input name="password" type="password" value="password" autocomplete="current-password" />
          </label>

          <footer>
            <button class="button-primary">Log in</button>
          </footer>
        </form>

        <script>
          login({ target }) {
            this.loading = true
            model.login(target.email.value, target.password.value).then(function() {
              dispatchEvent(new Event('login'))

            }).catch(err => {
              this.update({ failure: true, loading: false })
            })
          }
        </script>
      </div>
    `
  }
}
