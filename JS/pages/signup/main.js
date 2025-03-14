import { createFormState } from "./formState.js";
import { initProfileImageSelecter } from "./profileImageSelector.js";
import { isValidEmail, isValidNickname, isValidPassword, isValidPassword2 } from "./validator.js";

document.addEventListener('DOMContentLoaded', () => {



    const email_field = document.getElementById("email_field");
    const password_field = document.getElementById("password_field1");
    const password_confirm_field = document.getElementById("password_field2");
    const nickname_field = document.getElementById("nickname_field");

    const submitButton = document.getElementById('submit-btn');

    const helperTextElements = {
        profile: document.getElementById("helper-text1"),
        email: document.getElementById("helper-text2"),
        password: document.getElementById("helper-text3"),
        confirm: document.getElementById("helper-text4"),
        nickname: document.getElementById("helper-text5")
    }

    const formState = createFormState(helperTextElements, submitButton);

    // Event Listeners for Signup Page ============================
    email_field.addEventListener("input", () => {
        formState.updateFormState("email", isValidEmail(email_field.value));
    });

    password_field.addEventListener("input", () => {
        formState.updateFormState("password", isValidPassword(password_field.value));
    });

    password_confirm_field.addEventListener("input", () => {
        formState.updateFormState("confirm", isValidPassword2(password_field.value, password_confirm_field.value));
    });

    nickname_field.addEventListener("input", () => {
        formState.updateFormState("nickname", isValidNickname(nickname_field.value));
    });

    initProfileImageSelecter(formState);


    // Submit ===========================================
    submitButton.addEventListener("click", async () => {
        console.log("회원가입 API 호출");
        // try {
        //     if (!formState.isFormValid()) {
        //         return;
        //     }

        //     const response = await fetch("http://localhost:8080/api/users", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             email: email_field.value,
        //             password: password_field.value,
        //             nickname: nickname_field.value,
        //             profileImage: getProfileImage()
        //         })
        //     });

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message || "회원가입 중 오류가 발생했습니다.");
        //     }
        //     console.log("회원가입이 성공적으로 완료되었습니다.");
        //     window.location.href = 'login.html';
        // } catch (error) {
        //     console.error("회원가입 오류:", error);
        //     alert(error.message);
        // }
    });
});