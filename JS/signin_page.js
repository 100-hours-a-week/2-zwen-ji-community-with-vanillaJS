document.addEventListener('DOMContentLoaded', () => {
    const profileImageField = document.querySelector(".svg-container");
    const fileInput = document.getElementById('input_file_upload');
    const svg = profileImageField.querySelector('svg');
    const ellipse = svg.querySelector('ellipse');
    const profileSpace = document.getElementById('profile-space');
    const plusLines = svg.querySelectorAll('line');
    const submitButton = document.getElementById('submit-btn');

    const helperText1 = document.getElementById("helper-text1");
    const helperText2 = document.getElementById("helper-text2");
    const helperText3 = document.getElementById("helper-text3");
    const helperText4 = document.getElementById("helper-text4");
    const helperText5 = document.getElementById("helper-text5");

    const email_field = document.getElementById("email_field");
    const password_field1 = document.getElementById("password_field1");
    const password_field2 = document.getElementById("password_field2");
    const nickname_field = document.getElementById("nickname_field");

    fileInput.style.display = 'none';

    const formState = {
        profileValid: false,
        emailValid: false,
        passwordValid: false,
        confirmValid: false,
        nicknameValid: false,


        updateHelperText() {
            if (this.profileValid) {
                helperText1.textContent = "";
            } else {
                helperText1.textContent = "*프로필 사진을 업로드 해주세요.";
            }
        },

        updateValidation(isValid) {
            this.profileValid = isValid;
            this.updateHelperText();
            this.updateSubmitButton();
        },

        isFormValid() {
            return this.profileValid &&
                this.emailValid.isValid &&
                this.passwordValid.isValid &&
                this.confirmValid.isValid &&
                this.nicknameValid.isValid;
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

    formState.updateHelperText();
    helperText2.textContent = "*이메일을 입력하세요.";
    helperText3.textContent = "*비밀번호를 입력해주세요.";
    helperText4.textContent = "*비밀번호를 한번 더 입력해주세요.";
    helperText5.textContent = "*닉네임을 입력해주세요.";

    // 프로필 사진 =============================
    profileImageField.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            if (selectedFile.type.match('image.*')) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    if (profileSpace) {
                        profileSpace.setAttribute('href', e.target.result);

                        plusLines.forEach(line => {
                            line.style.display = 'none';
                        });

                        ellipse.setAttribute('display', 'none');
                        ellipse.setAttribute('stroke', '#ccc');
                        ellipse.setAttribute('stroke-width', '2');
                        formState.updateValidation(true);
                    }
                    console.log('이미지가 성공적으로 로드되었습니다');
                };

                reader.readAsDataURL(selectedFile);
            } else {
                console.error('선택한 파일이 이미지가 아닙니다');
                formState.updateValidation(false);
            }
        }
    });
    email_field.addEventListener("input", () => {
        const emailValue = email_field.value;
        const validationResult = isValidEmail(emailValue);
        formState.emailValid = validationResult;
        helperText2.textContent = validationResult.message;
        formState.updateSubmitButton();
    });
    password_field1.addEventListener("input", () => {
        formState.passwordValid = isValidPassword(password_field1.value);
        helperText3.textContent = formState.passwordValid.message;
        formState.updateSubmitButton();
    });

    password_field2.addEventListener("input", () => {
        formState.confirmValid = isValidPassword2(password_field1.value, password_field2.value);
        helperText4.textContent = formState.confirmValid.message;
        formState.updateSubmitButton();
    });

    nickname_field.addEventListener("input", () => {
        formState.nicknameValid = isValidNickname(nickname_field.value);
        helperText5.textContent = formState.nicknameValid.message;
        formState.updateSubmitButton();
    });


    submitButton.addEventListener("click", () => {
        console.log("회원가입 API 호출");
        console.log("회원가입 시나리오 완료.");
        window.location.href = 'login.html';

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

const NICKNAME_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*닉네임을 입력해주세요." },
    HAS_SPACES: { isValid: false, message: "*띄어쓰기 없이 작성해주세요" },
    TOO_SHORT: { isValid: false, message: "*닉네임은 2자 이상 작성해주세요." },
    TOO_LONG: { isValid: false, message: "*닉네임은 최대 10자까지 작성 가능합니다." }
}

const isValidNickname = (nickname) => {
    if (!nickname || nickname.trim() === '') {
        return NICKNAME_STATES.NO_VALUE;
    }

    if (nickname.includes(' ')) {
        return NICKNAME_STATES.HAS_SPACES;
    }

    if (nickname.length < 2) {
        return NICKNAME_STATES.TOO_SHORT;
    }

    if (nickname.length > 10) {
        return NICKNAME_STATES.TOO_LONG;
    }

    return NICKNAME_STATES.VALID;
};