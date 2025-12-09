const xInputSheet = new CSSStyleSheet();
fetch(new URL('./x-input.css', import.meta.url))
    .then(r => r.text())
    .then(css => xInputSheet.replaceSync(css));

class XInput extends HTMLElement {

    // Will be needed to trigger callbacks on update
    static get observedAttributes() {
        return ['label', 'placeholder', 'value', 'type', 'disabled'];
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.adoptedStyleSheets = [xInputSheet];

        root.innerHTML = `
            <div class="wrapper">
                <label part="label">
                <span class="label-text"></span>
                <input part="input" />
                </label>
                <slot name="helper" class="helper"></slot>
            </div>
        `;
    }
}

customElements.define('x-input', XInput);
