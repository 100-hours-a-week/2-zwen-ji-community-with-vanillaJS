import { isValidProfileImage } from "../../utils/validator.js";

export function getProfileImage(profileSpace) {
    return profileSpace ? profileSpace.getAttribute('src') : null;
}

// Entry Point ====================================
export function initProfileImageSelecter(formState) {
    const profileImageField = document.querySelector(".svg-container");
    const profileImageInput = document.getElementById('input_file_upload');
    const profileImage = document.getElementById('profile_image');
    const svgElement = document.querySelector('.svg-container');

    profileImage.style.display = 'none';
    profileImageField.addEventListener('click', () => { profileImageInput.click(); });

    formState.updateFormState("profile", { isValid: false, message: "*프로필 사진을 업로드 해주세요." });

    function loadImagePreview(imageFile, imageElement) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imageElement.setAttribute('src', e.target.result);

            // 이미지를 보이게 하고 SVG 컨테이너 숨기기
            imageElement.style.display = 'inline-block';
            svgElement.style.display = 'none';

            console.log('이미지가 성공적으로 로드되었습니다');
        };

        reader.readAsDataURL(imageFile);
    }

    // // 프로필 UI 업데이트 함수
    // function updateProfileUI(container) {
    //     // 필요한 UI 요소 업데이트 (예: SVG 요소)
    //     const svg = container.querySelector('svg');
    //     svg.
    // }


    profileImageInput.addEventListener('change', (event) => {
        const selectedFile = event.target.files[0];
        const validationResult = isValidProfileImage(selectedFile);
        if (validationResult.isValid) {
            loadImagePreview(selectedFile, profileImage);
        }
        formState.updateFormState("profile", validationResult);
    });

}


