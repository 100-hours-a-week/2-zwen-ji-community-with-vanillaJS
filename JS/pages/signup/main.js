import { createFormState } from "../../utils/formState.js";
import { getProfileImageFile, initProfileImageSelecter } from "../../utils/profileImageSelector.js";
import { isValidConfirm, isValidEmail, isValidNickname, isValidPassword } from "../../utils/validator.js";

document.addEventListener('DOMContentLoaded', () => {

    const email_field = document.getElementById("email_field");
    const password_field = document.getElementById("password_field1");
    const password_confirm_field = document.getElementById("password_field2");
    const nickname_field = document.getElementById("nickname_field");

    const submitButton = document.getElementById('submit-btn');

    const fields = ['profile', 'email', 'password', 'confirm', 'nickname'];
    const helperTextElements = {
        profile: document.getElementById("helper-text1"),
        email: document.getElementById("helper-text2"),
        password: document.getElementById("helper-text3"),
        confirm: document.getElementById("helper-text4"),
        nickname: document.getElementById("helper-text5")
    }

    const formState = createFormState(fields, helperTextElements, submitButton);

    // Event Listeners for Signup Page ============================
    email_field.addEventListener("input", () => {
        formState.updateFormState("email", isValidEmail(email_field.value));
    });

    password_field.addEventListener("input", () => {
        formState.updateFormState("password", isValidPassword(password_field.value));
    });

    password_confirm_field.addEventListener("input", () => {
        formState.updateFormState("confirm", isValidConfirm(password_field.value, password_confirm_field.value));
    });

    nickname_field.addEventListener("input", () => {
        formState.updateFormState("nickname", isValidNickname(nickname_field.value));
    });

    initProfileImageSelecter(formState);



    submitButton.addEventListener("click", async () => {
        console.log("회원가입 버튼 클릭됨");

        try {
            if (!formState.isFormValid()) {
                console.warn("폼이 유효하지 않음, 제출 중단");
                return;
            }

            const formData = new FormData();

            const userData = {
                email: email_field.value,
                password: password_field.value,
                nickname: nickname_field.value
            };
            console.log("사용자 데이터:", userData);

            formData.append('userData', new Blob([JSON.stringify(userData)], {
                type: 'application/json'
            }));

            const profileFile = getProfileImageFile();
            console.log("가져온 프로필 이미지 파일:", profileFile);

            if (profileFile) {
                formData.append('profileImage', profileFile);
                console.log("프로필 이미지 파일 추가됨:", profileFile.name);
            } else {
                console.warn("프로필 이미지 파일 없음");
            }

            // FormData 내용 확인
            console.log("FormData 내용 확인:");
            for (let pair of formData.entries()) {
                const value = pair[1];
                const valueInfo = value instanceof File
                    ? `File: ${value.name}, ${value.type}, ${value.size} bytes`
                    : value;
                console.log(`${pair[0]}: ${valueInfo}`);
            }

            // 서버에 요청 보내기
            console.log("서버 요청 시작...");
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                body: formData
                // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음
            });
            console.log("서버 응답 상태:", response.status);

            const responseText = await response.text();
            console.log("서버 응답 텍스트:", responseText);

            let data = null;
            if (responseText && responseText.trim()) {
                try {
                    data = JSON.parse(responseText);
                    console.log("서버 응답 데이터:", data);
                } catch (e) {
                    console.error("JSON 파싱 오류:", e);
                }
            }

            if (response.ok) {
                console.log("회원가입 성공!");
                alert("회원가입이 성공적으로 완료되었습니다!");
                window.location.href = 'login.html';
            } else {
                throw new Error(data?.message || "회원가입 중 오류가 발생했습니다");
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert(error.message);
        }
    });
})