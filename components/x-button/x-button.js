const sheet = new CSSStyleSheet();
fetch(new URL('./x-button.css', import.meta.url))
    .then(r => r.text())
    .then(css => sheet.replaceSync(css));

class XButton extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.adoptedStyleSheets = [sheet];
        root.innerHTML = `
            <button part="button">
                <slot></slot>
            </button>
        `;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('button')
            .addEventListener('click', () => {
                console.log('<x-button> clicked!');
            });
    }
}

customElements.define('x-button', XButton);
