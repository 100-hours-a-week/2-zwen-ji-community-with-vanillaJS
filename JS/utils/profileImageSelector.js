import { isValidProfileImage } from "./validator.js";

// 선택된 파일을 저장할 변수 추가
let selectedProfileImageFile = null;

// 파일 가져오는 함수
export function getProfileImageFile() {
    return selectedProfileImageFile;
}

export function initProfileImageSelecter(formState) {
    const profileImageField = document.querySelector(".svg-container");
    const profileImageInput = document.getElementById('input_file_upload');
    const profileImage = document.getElementById('profile_image');
    const svgElement = document.querySelector('.svg-container');

    // 초기 상태 설정
    profileImage.style.display = 'none';
    profileImageField.addEventListener('click', () => {
        profileImageInput.click();
    });

    // 폼 상태 초기화
    if (formState) {
        formState.updateFormState("profile", {
            isValid: false,
            message: "*프로필 사진을 업로드 해주세요."
        });
    }



    profileImageInput.addEventListener('change', (event) => {
        console.log("파일 선택 이벤트 발생");


        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log("선택된 파일:", file.name, file.type, file.size);

            const validationResult = isValidProfileImage(file);

            if (validationResult.isValid) {
                // 선택된 파일 저장
                selectedProfileImageFile = file;
                console.log("프로필 이미지 파일 저장됨:", file.name);

                // 이미지 미리보기 표시
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImage.src = e.target.result;
                    profileImage.style.display = 'inline-block';
                    svgElement.style.display = 'none';
                    console.log('이미지 미리보기 로드됨');
                };
                reader.readAsDataURL(file);
            } else {
                console.warn("유효하지 않은 이미지:", validationResult.message);
            }

            // 폼 상태 업데이트
            if (formState) {
                formState.updateFormState("profile", validationResult);
            }

        } else {
            console.log("파일이 선택되지 않음");
        }
    });
}