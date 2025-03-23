import { updatePassword } from "../../api/users_api.js";
import { createFormState } from "../../utils/formState.js";
import { manageLoginStatus } from "../../utils/login.js";
import { showToast } from "../../utils/toast.js";
import { isValidConfirm, isValidPassword } from "../../utils/validator.js";

document.addEventListener('DOMContentLoaded', () => {
    manageLoginStatus();

    const password_field = document.getElementById('password_input1');
    const password_confirm_field = document.getElementById('password_input2');
    const submitButton = document.getElementById('submit-button');

    const fields = ['password', 'confirm'];
    const helperTextElements = {
        password: document.getElementById("helper-text1"),
        confirm: document.getElementById("helper-text2")
    }
    const formState = createFormState(fields, helperTextElements, submitButton);


    password_field.addEventListener("input", () => {
        formState.updateFormState("password", isValidPassword(password_field.value));
    });

    password_confirm_field.addEventListener("input", () => {
        formState.updateFormState("confirm", isValidConfirm(password_field.value, password_confirm_field.value));
    });

    submitButton.addEventListener('click', async () => {
        try {
            const newPassword = password_field.value;

            console.log("비밀번호 수정 API 호출");

            const result = await updatePassword(newPassword);

            if (result.status === "success") {
                showToast("비밀번호가 성공적으로 변경되었습니다.");


                password_field.value = '';
                password_confirm_field.value = '';

            } else {
                showToast(result.message || "비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            showToast(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
            console.error("비밀번호 변경 오류:", error);
        } finally {
            formState.updateSubmitButton();
        }
    });
});
