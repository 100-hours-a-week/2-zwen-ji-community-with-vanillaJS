// Email ==========================================
const EMAIL_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*이메일을 입력하세요." },
    INVALID_EMAIL: { isValid: false, message: "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com" },
    DUPLICATION_EMAIL: { isValid: false, message: "*중복된 이메일입니다." }
}

export const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (email.length == 0) {
        return EMAIL_STATES.NO_VALUE;
    }
    if (!emailPattern.test(email)) {
        return EMAIL_STATES.INVALID_EMAIL;
    }
    else return EMAIL_STATES.VALID;
}


// Password =========================================
const PASSWORD_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*비밀번호를 입력해주세요." },
    INVALID_PASSWORD: {
        isValid: false,
        message: "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다."
    }
}

export const isValidPassword = (password) => {
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


// Password Confirm =================================
const PASSWORD_CONFIRM_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*비밀번호를 한번 더 입력해주세요." },
    INVALID_PASSWORD_CONFIRM: { isValid: false, message: "비밀번호와 다릅니다." }
}

export const isValidPassword2 = (password, confirm) => {
    if (confirm.length == 0) {
        return PASSWORD_CONFIRM_STATES.NO_VALUE;
    }
    if (password != confirm) {
        return PASSWORD_CONFIRM_STATES.INVALID_PASSWORD_CONFIRM;
    }
    else {
        return PASSWORD_CONFIRM_STATES.VALID;
    }
}



// Nickname ========================================
const NICKNAME_STATES = {
    VALID: { isValid: true, message: "" },
    NO_VALUE: { isValid: false, message: "*닉네임을 입력해주세요." },
    HAS_SPACES: { isValid: false, message: "*띄어쓰기 없이 작성해주세요" },
    TOO_SHORT: { isValid: false, message: "*닉네임은 2자 이상 작성해주세요." },
    TOO_LONG: { isValid: false, message: "*닉네임은 최대 10자까지 작성 가능합니다." }
}

export const isValidNickname = (nickname) => {
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

// Profile Image ======================================

export function isValidProfileImage(file) {
    if (!file) {
        return { isValid: false, message: "*프로필 사진을 업로드 해주세요." };
    }

    if (!file.type.match('image.*')) {
        return { isValid: false, message: "*이미지 파일만 업로드 가능합니다." };
    }

    return { isValid: true, message: "" };
}