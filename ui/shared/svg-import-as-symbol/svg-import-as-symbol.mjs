// Inspired by:
// - https://dev.to/dannyengelman/load-file-web-component-add-external-content-to-the-dom-1nd
// - https://nuejs.org/docs/core-components.html#symbols

import html from '../html/html-tag.mjs'

export default class SVGImportAsSymbolComponent extends HTMLElement {
  static {
    customElements.define('svg-import-as-symbol', this)
  }

  static DEFAULT_SIZE = 24

  connectedCallback() {
    const src = this.getAttribute('src')
    const symbolId = this.getAttribute('symbol-id')
    const width = Number(
      this.getAttribute('width') ?? this.getAttribute('size') ?? SVGImportAsSymbolComponent.DEFAULT_SIZE
    )
    const height = Number(
      this.getAttribute('height') ?? this.getAttribute('size') ?? SVGImportAsSymbolComponent.DEFAULT_SIZE
    )

    if (symbolId && src) {
      fetch(src)
        .then((response) => response.text())
        .then((svgContent) => {
          const parser = new DOMParser()
          const svg = parser.parseFromString(svgContent, 'image/svg+xml')
          const svgChildContent = svg.documentElement.innerHTML

          this.innerHTML = html`
            <svg>
              <symbol id="${symbolId}" viewBox="0 0 ${width} ${height}">${svgChildContent}</symbol>
            </svg>
          `
        })
    }
  }
}
