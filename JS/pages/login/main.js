import { createFormState } from "../../utils/formState.js";
import { isValidEmail, isValidPassword } from "../../utils/validator.js";

document.addEventListener('DOMContentLoaded', () => {
    const email_field = document.getElementById('email-field');
    const password_field = document.getElementById('password-field');
    const submitButton = document.getElementById('submit-button');

    const helperTextElements = {
        helpertext1: document.getElementById('help1')
    }
    const fields = ['email', 'password'];

    const formState = createFormState(fields, helperTextElements, submitButton);

    //  오버라이딩 
    formState.updateFormState = function (fieldName, validationResult) {
        this[`${fieldName}Valid`] = validationResult.isValid;
        this.updateHelperText('helpertext1', validationResult.message);
        this.updateSubmitButton();
    };

    email_field.addEventListener("input", () => {
        formState.updateFormState('email', isValidEmail(email_field.value));
        if (formState.emailValid) {
            formState.updateFormState('password', isValidPassword(password_field.value));
        }
    });
    password_field.addEventListener("input", () => {
        formState.updateFormState('password', isValidPassword(password_field.value));
    });

    submitButton.addEventListener("click", async () => {
        console.log("로그인 API 호출");
    });
});