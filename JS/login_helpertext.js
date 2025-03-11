document.addEventListener('DOMContentLoaded', () => {
    const helpertext1 = document.getElementById('help1');
    const email_field = document.getElementById('email-field');
    const password_field = document.getElementById('password-field');
    const submitButton = document.getElementById('submit-button');

    const formState = {
        emailValidation: { isValid: false, message: "*이메일을 입력하세요." },
        passwordValidation: { isValid: false, message: "*비밀번호를 입력하세요." },


        updateHelperText() {
            if (!this.emailValidation.isValid) {
                helpertext1.textContent = this.emailValidation.message;
            } else if (!this.passwordValidation.isValid) {
                helpertext1.textContent = this.passwordValidation.message;
            } else {
                helpertext1.textContent = this.passwordValidation.message;
            }
        },

        isFormValid() {
            return this.emailValidation.isValid && this.passwordValidation.isValid;
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
    }
    formState.updateHelperText();

    email_field.addEventListener("input", () => {
        const emailValue = email_field.value;
        const validationResult = isValidEmail(emailValue);
        formState.emailValidation = validationResult;
        formState.updateHelperText();
        formState.updateSubmitButton();
    });

    password_field.addEventListener("input", () => {
        const passwordValue = password_field.value;
        const validationResult = isValidPassword(passwordValue);
        formState.passwordValidation = validationResult;
        formState.updateHelperText();
        formState.updateSubmitButton();
    });
});



const isValidEmail = (email) => {
    let len = email.length;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (len == 0) {
        return { isValid: false, message: "*이메일을 입력하세요." }
    }
    if (email.length < 5) {
        return { isValid: false, message: "*이메일이 너무 짧습니다." };
    }
    if (!emailPattern.test(email)) {
        return { isValid: false, message: "*올바른 이메일 주소 형식을 입력해주세요." }
    }
    else { return { isValid: true, message: "" }; }
}




const PASSWORD_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*비밀번호를 입력해주세요." },
    INVALID_PASSWORD: {
        isValid: false,
        message: "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
    }

}


const isValidPassword = (password) => {
    let len = password.length;
    if (len == 0) {
        return PASSWORD_STATES.NO_VALUE;
    }
    if (len < 8 || len > 20) {
        return PASSWORD_STATES.INVALID_PASSWORD;
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/.test(password)) {

        return PASSWORD_STATES.INVALID_PASSWORD;
    }
    return PASSWORD_STATES.VALID;
}

