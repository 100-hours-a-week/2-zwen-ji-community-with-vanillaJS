import { showToast } from "../utils/toast.js";

document.addEventListener('DOMContentLoaded', () => {
    const helpertext1 = document.getElementById('helper-text1');
    const helpertext2 = document.getElementById('helper-text2');
    const password_field1 = document.getElementById('password_input1');
    const password_field2 = document.getElementById('password_input2');
    const submitButton = document.getElementById('submit-button');

    const formState = {
        passwordValidation1: { isValid: false, message: "*비밀번호를 입력하세요." },
        passwordValidation2: { isValid: false, message: "*비밀번호를 한번 더 입력하세요." },


        updateHelperText() {
            helpertext1.textContent = this.passwordValidation1.message;
            helpertext2.textContent = this.passwordValidation2.message;

        },

        isFormValid() {
            return this.passwordValidation1.isValid && this.passwordValidation2.isValid;
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
    password_field1.addEventListener("input", () => {
        formState.passwordValidation1 = isValidPassword1(password_field1.value, password_field2.value);
        formState.passwordValidation2 = isValidPassword2(password_field1.value, password_field2.value);
        formState.updateHelperText();
        formState.updateSubmitButton();
    });

    password_field2.addEventListener("input", () => {
        formState.passwordValidation2 = isValidPassword2(password_field1.value, password_field2.value);
        formState.passwordValidation1 = isValidPassword1(password_field1.value, password_field2.value);
        formState.updateHelperText();
        formState.updateSubmitButton();
    });
    submitButton.addEventListener('click', () => {
        console.log("비밀번호 수정 API 호출")
        showToast("수정 완료.");

    });
});

const isValidPassword1 = (password, confirm) => {
    let len = password.length;
    if (len == 0) {
        return { isValid: false, message: "*비밀번호를 입력해주세요." }
    }
    if (password != confirm) {
        return { isValid: false, message: "*비밀번호 확인과 다릅니다." };
    }
    else { return { isValid: true, message: "" }; }
}

const isValidPassword2 = (password, confirm) => {
    let len = password.confirm;
    if (len == 0) {
        return { isValid: false, message: "*비밀번호를 한번 더 입력해주세요." }
    }
    if (password != confirm) {
        return { isValid: false, message: "*비밀번호와 다릅니다." };
    }
    else { return { isValid: true, message: "" }; }
}