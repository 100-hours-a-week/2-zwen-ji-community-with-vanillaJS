import { modalManager } from '../post_components/modal.js';
import { showToast } from '../utils/toast.js';

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
    if (!user) {
        // 에러 메시지를 표시할 요소가 있는지 확인
        const errorElement = document.getElementById('profile-error');
        if (errorElement) {
            errorElement.textContent = '사용자 정보를 불러올 수 없습니다.';
        }
        return;
    }

    // 닉네임 설정
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.value = user.nickname || '';
    }

    // 이메일 설정
    const emailElement = document.getElementById('email');
    if (emailElement) {
        emailElement.textContent = user.email || '';
    }

    // 프로필 이미지 설정
    const profileImg = document.getElementById('profile-image');
    if (profileImg && user.profileImage) {
        profileImg.src = user.profileImage;
    }

    // 추가 정보 설정 (있는 경우)
    const bioElement = document.getElementById('bio');
    if (bioElement && user.bio) {
        bioElement.value = user.bio;
    }
}

async function initEditProfilePage() {
    try {
        const userData = await fetchUserProfile();
        renderUserProfile(userData);
    } catch (error) {
        console.error('초기화 오류:', error);
    }
    setupFormSubmission();
    modalManager.setup();
    // 회원 탈퇴 버튼 설정
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
            // userId 값을 가져오는 로직이 필요합니다
            const userId = getCurrentUserId(); // 이 함수는 별도로 구현해야 합니다
            modalManager.openDropModal(userId);
        });
    } else {
        console.warn("회원 탈퇴 버튼을 찾을 수 없습니다.");
    }
}

function getCurrentUserId() {
    // 여기에 현재 사용자 ID를 가져오는 로직 구현
    // 예: 로컬 스토리지, 세션 스토리지, 쿠키 등에서 가져올 수 있음
    return localStorage.getItem('userId') || 'defaultUserId';
}

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



document.addEventListener('DOMContentLoaded', initEditProfilePage);