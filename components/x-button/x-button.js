const sheet = new CSSStyleSheet();
fetch('./components/x-button/x-button.css')
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
