export function createFormState(fields, helperTextElements, submitButton) {
    const state = {
        ...Object.fromEntries(fields.map(field => [`${field}Valid`, false])),

        isFormValid() {
            return Object.keys(this)
                .filter(key => key.endsWith('Valid') && typeof this[key] !== 'function')
                .every(key => this[key] == true);
        },

        updateFormState(fieldName, validationResult) {
            this[`${fieldName}Valid`] = validationResult.isValid;
            this.updateHelperText(fieldName, validationResult.message);
            this.updateSubmitButton();
        },

        updateHelperText(fieldName, message) {
            const helperTextElement = helperTextElements[fieldName];
            if (helperTextElement) {
                helperTextElement.textContent = message || '';
            }
        },

        updateSubmitButton() {
            if (submitButton) {
                if (this.isFormValid()) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-disabled');
                    submitButton.classList.add('btn-active');
                } else {
                    submitButton.disabled = true;
                    submitButton.classList.remove('btn-active');
                    submitButton.classList.add('btn-disabled');
                }
            }
        }
    };

    return state;
}
