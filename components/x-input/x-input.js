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

        // Forward user input -> attribute + re-emit event outside shadow DOM
        this._inputEl.addEventListener('input', () => {
            const v = this._inputEl.value;

            // Avoid redundant attribute updates (prevents loops/caret issues)
            if (this.getAttribute('value') !== v) {
                this.setAttribute('value', v);
            }

            // Re-emit so consumers can listen on <x-input>
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        });

        // Forward change event too (optional but nice)
        this._inputEl.addEventListener('change', () => {
            this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        });
    }

    connectedCallback() {
        // Ensure initial render reflects any pre-set attributes
        this._syncAllAttributes();
    }

    attributeChangedCallback(name, oldValue, newValue) {
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
                this._inputEl.type = newValue || 'text';
                break;

            case 'disabled':
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
        if (isDisabled) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
    }

    // ---- Helpers ----
    _syncAllAttributes() {
        for (const attr of XInput.observedAttributes) {
            this.attributeChangedCallback(attr, null, this.getAttribute(attr));
        }
    }
}

customElements.define('x-input', XInput);
