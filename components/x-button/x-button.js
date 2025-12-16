const sheet = new CSSStyleSheet();
fetch(new URL('./x-button.css', import.meta.url))
    .then(r => r.text())
    .then(css => sheet.replaceSync(css));

class XButton extends HTMLElement {
    static get observedAttributes() {
        return ['disabled', 'type'];
    }

    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });
        root.adoptedStyleSheets = [sheet];
        root.innerHTML = `
            <button part="button">
                <slot></slot>
            </button>
        `;

        this._btn = root.querySelector('button');

        this._onClick = (e) => {
            // If disabled, block any action
            if (this.disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            this.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
        };

        this._btn.addEventListener('click', this._onClick);
    }

    connectedCallback() {
        this._syncFromAttributes();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (!this._btn) return;

        if (name === 'disabled') {
            this._btn.disabled = newValue !== null;
        }

        if (name === 'type') {
            this._btn.type = newValue || 'button';
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(v) {
        if (v) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    get type() {
        return this.getAttribute('type') ?? 'button';
    }

    set type(v) {
        this.setAttribute('type', v ?? 'button');
    }

    _syncFromAttributes() {
        this._btn.disabled = this.disabled;
        this._btn.type = this.type;
    }
}

customElements.define('x-button', XButton);
