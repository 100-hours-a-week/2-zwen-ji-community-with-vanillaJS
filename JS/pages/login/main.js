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
    formState.updateSubmitButton();

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
        try {
            if (!formState.isFormValid()) {
                return;
            }

            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email_field.value,
                    password: password_field.value,
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "로그인에 실패했습니다");
            }

            const data = await response.json();
            console.log("로그인 성공:", data);

            localStorage.setItem("userId", data.id);
            localStorage.setItem("profileImage", data.profileImage || "default-profile.jpg");

            window.location.href = 'list.html';
        } catch (error) {
            console.error("로그인 오류:", error.message);
            //로그인 실패 로직 
        }
    });
});