function checkLoginStatus() {
    const userId = localStorage.getItem("userId");
    return !!userId;
}

async function loadUserProfile() {
    try {
        const userId = localStorage.getItem("userId");
        const profileImage = localStorage.getItem("profileImage");

        // 프로필 이미지 표시
        const profileElement = document.getElementById('curr_user_profile_image');
        if (profileElement) {
            profileElement.src = profileImage || null;
        }

        // // 마지막 로드 시간 확인
        // const now = Date.now();
        // const lastUpdate = userInfo.timestamp || 0;

        // // 30분(1800000ms)이 지났으면 사용자 정보 갱신
        // if (now - lastUpdate > 1800000) {
        //     await refreshUserData(userId);
        // }
    } catch (error) {
        console.error('사용자 프로필 로드 중 오류 발생:', error);
    }
}

export async function manageLoginStatus() {
    const isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    await loadUserProfile();
}
