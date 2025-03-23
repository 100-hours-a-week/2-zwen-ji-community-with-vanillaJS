import { deleteUser, fetchUser, updateNickname, uploadProfileImage } from "../../api/users_api.js";
import { createFormState } from "../../utils/formState.js";
import { loadUserProfile, manageLoginStatus } from "../../utils/login.js";
import { ModalManager } from "../../utils/modal.js";
import { initProfileImageSelecter } from "../../utils/profileImageSelector.js";
import { getCurrentUserId } from "../../utils/user.js";
import { isValidNickname } from "../../utils/validator.js";

document.addEventListener('DOMContentLoaded', function () {
    manageLoginStatus();

    const profileImageInput = document.getElementById('input_file_upload');
    const nicknameField = document.getElementById('nickname');
    const nicknameHelperText = document.getElementById("nickname_helpertext");
    const submitButton = document.getElementById("submit-btn");

    let isProfileImageChanged = false;
    // 폼 상태 관리
    const formState = createFormState(['nickname'], nicknameHelperText, submitButton);

    // 프로필 이미지 선택기 초기화
    initProfileImageSelecter();

    // 현재 사용자 ID 가져오기
    const userId = getCurrentUserId();

    // 사용자 프로필 로드
    renderUserProfile(userId);


    nicknameField.addEventListener('input', () => {
        const result = isValidNickname(nicknameField.value.trim());
        formState.updateFormState('nickname', result);
    });

    profileImageInput.addEventListener('change', (event) => {
        isProfileImageChanged = event.target.files && event.target.files.length > 0;

        // 이미지 파일 유효성 검사 (옵션)
        if (isProfileImageChanged) {
            const file = event.target.files[0];

            if (!file.type.match('image.*')) {
                profileImageInput.value = '';
                isProfileImageChanged = false;
            }
            submitButton.disabled = false;
            submitButton.classList.remove('btn-disabled');
            submitButton.classList.add('btn-active');
        }
    });

    setupDropButton();

    // 제출 버튼 클릭 이벤트
    submitButton.addEventListener("click", async () => {
        const nickname = nicknameField.value.trim();
        try {
            if (!formState.isFormValid() && !isProfileImageChanged) {
                return;
            }

            submitButton.disabled = true;

            // 닉네임 업데이트
            if (nickname) {
                await updateNickname(userId, nickname);

            }

            // 프로필 이미지 업데이트
            if (profileImageInput.files && profileImageInput.files.length > 0) {
                const result = await uploadProfileImage(userId, profileImageInput.files[0]);
                alert("프로필이 성공적으로 업데이트되었습니다.");
                console.log(result.data.profileImageUrl);
                localStorage.setItem('profileImageUrl', result.data.profileImageUrl);
            }


            window.location.reload();

        } catch (error) {
            console.error("프로필 업데이트 오류:", error);
            alert(error.message);
        } finally {
            submitButton.disabled = false;
        }
    });
});


async function renderUserProfile(userId) {
    try {
        const result = await fetchUser(userId);

        // 닉네임 설정
        const nicknameInput = document.getElementById('nickname');
        if (nicknameInput) {
            nicknameInput.value = result.nickname || '';
        }

        // 이메일 설정
        const emailElement = document.getElementById('email');
        if (emailElement) {
            emailElement.textContent = result.email || '';
        }

        // 프로필 이미지 설정
        const profileImg = document.getElementById('profile_image');
        if (profileImg && result.profileImageUrl) {
            loadUserProfile(result.profileImageUrl, profileImg);
            profileImg.setAttribute("style", "display: block");
        }

        return result;
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
    }
}

function setupDropButton() {
    const dropBtn = document.getElementById("drop-btn");
    if (dropBtn) {
        console.log("Asddas");
        const userId = getCurrentUserId();
        const userDeleteModal = new ModalManager({
            trigger: dropBtn,
            callback: async () => {
                const response = await deleteUser(userId);
                if (response.status == "success") {
                    window.location.href = "login.html";
                }
            },
            mainText: '회원탈퇴 하시겠습니까?',
            subText: '작성된 게시글과 댓글은 삭제됩니다.'
        });
    } else {
        console.warn("회원 탈퇴 버튼을 찾을 수 없습니다.");
    }
}