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

        // Cache references to internal elements
        this._labelTextEl = root.querySelector('.label-text');
        this._inputEl = root.querySelector('input');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Ignore if nothing changed
        if (oldValue === newValue) return;

        if (!this._inputEl || !this._labelTextEl) return;

        switch (name) {
            case 'label':
                this._labelTextEl.textContent = newValue ?? '';
                break;

            case 'placeholder':
                this._inputEl.placeholder = newValue ?? '';
                break;

            case 'value':
                this._inputEl.value = newValue ?? '';
                break;

            case 'type':
                // Input type (text, email, password, etc.)
                this._inputEl.type = newValue || 'text';
                break;

            case 'disabled':
                // Boolean attribute: presence = true, absence = false
                this._inputEl.disabled = newValue !== null;
                break;
        }
    }

    get value() {
        return this._inputEl?.value ?? '';
    }

    set value(v) {
        this.setAttribute('value', v ?? '');
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(isDisabled) {
        if (isDisabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
}

customElements.define('x-input', XInput);
