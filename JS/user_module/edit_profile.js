import { modalManager } from '../post_components/modal.js';
import { showToast } from '../utils/toast.js';
import { getCurrentUser, getCurrentUserId } from '../utils/user.js';

async function fetchUserProfile() {
    try {
        const response = await fetch('/api/users/me');
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            return result.data;
        } else {
            console.error('API 오류:', result);
            return null;
        }
    } catch (error) {
        console.error('사용자 정보 로드 오류:', error);
        return null;
    }
}

function renderUserProfile(user) {
    //setupMockUser();
    if (!user) {
        const errorElement = document.getElementById('profile-error');
        if (errorElement) {
            errorElement.textContent = '사용자 정보를 불러올 수 없습니다.';
        }
        return;
    }

    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.value = user.userNickname || '';
    }

    const emailElement = document.getElementById('email');
    if (emailElement) {
        emailElement.textContent = user.userEmail || '';
    }

    const profileImg = document.getElementById('profile_image');
    const defaultProfileContainer = document.getElementById('default_profile_container');

    if (profileImg) {
        if (user.userProfileImage) {
            profileImg.src = user.userProfileImage;
            profileImg.style.display = 'block';

            if (defaultProfileContainer) {
                defaultProfileContainer.style.display = 'none';
            }
        } else {
            profileImg.style.display = 'none';

            if (defaultProfileContainer) {
                defaultProfileContainer.style.display = 'block';
            } else {
                profileImg.src = '/assets/default_profile.svg';
                profileImg.style.display = 'block';
            }
        }
    }
}



async function initEditProfilePage() {
    const cachedUserData = getCurrentUser();
    if (cachedUserData && Object.keys(cachedUserData).length > 0) {
        console.log("로컬 스토리지에서 사용자 정보를 불러옴.");
        renderUserProfile(cachedUserData);
    }

    // try {
    //     const userData = await fetchUserProfile();

    //     if (JSON.stringify(userData) !== JSON.stringify(cachedUserData)) {
    //         renderUserProfile(userData);

    //         localStorage.setItem('userInfo', JSON.stringify(userData));
    //     }
    // } catch (error) {
    //     console.error('프로필 데이터 가져오기 오류:', error);
    //     const errorNotice = document.getElementById('sync-error');
    //     if (errorNotice) {
    //         errorNotice.textContent = '최신 정보를 불러오지 못했습니다.';
    //         errorNotice.style.display = 'block';
    //     }
    // }

    setupFormSubmission();
    modalManager.setup();

    try {
        setupDropButton();
    } catch (error) {
        console.error('회원 탈퇴 버튼 설정 오류:', error);
    }
}

function setupDropButton() {
    const dropBtn = document.getElementById("drop-btn");
    if (dropBtn) {
        dropBtn.addEventListener('click', () => {
            const userId = getCurrentUserId();
            modalManager.openDropModal(userId);
        });
    } else {
        console.warn("회원 탈퇴 버튼을 찾을 수 없습니다.");
    }
}



// Form 유효성 검사 ===============================
function checkFormValid(nickname) {
    const helperText = document.querySelector('.helper-text');
    if (!nickname || nickname.trim() === '') {
        if (helperText) {
            helperText.textContent = "*닉네임을 입력하세요.";
        }
        return false;
    }

    if (nickname.length < 2 || nickname.length > 10) {
        if (helperText) {
            helperText.textContent = "*닉네임은 최대 10자 까지 작성 가능합니다.";
        }
        return false;
    }

    if (helperText) {
        helperText.textContent = "";
    }
    return true;
}

// 폼 제출 처리 설정
function setupFormSubmission() {
    const editForm = document.getElementById('edit-profile-form');
    const submitBtn = document.getElementById('submit-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // 버튼이 폼 안에 있으므로 기본 제출 동작 방지

            const nicknameInput = document.getElementById('nickname');
            if (!nicknameInput) {
                console.error('닉네임 입력 필드를 찾을 수 없습니다.');
                return;
            }

            const nickname = nicknameInput.value;

            // 유효성 검사
            if (!checkFormValid(nickname)) {
                return;
            }

            try {
                const response = await fetch('/api/users/me', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickname: nickname
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === 'success') {
                    console.log('프로필이 성공적으로 업데이트되었습니다.');
                    showToast("수정 완료", 'success');
                } else {
                    console.log('프로필 업데이트에 실패했습니다: ' + result.message);
                }
            } catch (error) {
                console.error('프로필 업데이트 오류:', error);
            }
        });
    }
}


// Entry Point ================================
document.addEventListener('DOMContentLoaded', initEditProfilePage);