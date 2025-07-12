import html from '../shared/html/html-tag.mjs'

export default class RecordsUserComponent extends HTMLElement {
  static {
    customElements.define('records-user', this)
  }

  static DEFAULT_SIZE = 40

  connectedCallback() {
    // TODO ACY lire et peut être utiliser (ici et partout ailleurs) la syntaxe décrite ici : https://blog.ltgt.net/web-component-properties/
    const image = this.getAttribute('image')
    const title = this.getAttribute('title') ?? ''
    const width = Number(this.getAttribute('width') ?? RecordsUserComponent.DEFAULT_SIZE)
    const height = Number(this.getAttribute('height') ?? width)

    const childContent = this.innerHTML

    this.innerHTML = html`
      <div class="media-object">
        <figure><img class="media-object-avatar" src="${image}" width="${width}" height="${height}" /></figure>
        <div>
          <header class="media-object-title">${title}</header>
          <p class="media-object-subtitle">${childContent}</p>
        </div>
      </div>
    `
  }
}
