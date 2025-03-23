function checkLoginStatus() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    return !!(userId && token);
}

function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        // 토큰의 페이로드 부분 추출 및 디코딩
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp 필드는 토큰 만료 시간(초 단위)
        return payload.exp * 1000 > Date.now(); // 밀리초로 변환하여 비교
    } catch (e) {
        console.error("토큰 검증 중 오류 발생:", e);
        return false;
    }
}

export function loadUserProfile(profileImageUrl, profileElement) {

    fetch(`http://localhost:8080${profileImageUrl}`, addAuthHeader())
        .then(response => {
            if (!response.ok) {
                throw new Error('Image loading failed');
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            profileElement.src = imageUrl;
        })
        .catch(error => {
            console.error('Error loading image:', error);
        });

}
async function loadCurrUserProfile() {
    try {
        const profileImageUrl = localStorage.getItem("profileImageUrl") || "default_profile.jpg";

        // 프로필 이미지 표시
        const profileElement = document.getElementById('curr_user_profile_image');
        if (profileElement) {
            loadUserProfile(profileImageUrl, profileElement);
        }
        setDropDown();
        console.log("프로필 드롭다운 초기화 완료");
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

export function addAuthHeader(options = {}) {
    const token = localStorage.getItem("token");
    if (!token) return options;

    // headers 객체가 없으면 생성
    if (!options.headers) {
        options.headers = {};
    }
    // Authorization 헤더 추가
    options.headers.Authorization = `Bearer ${token}`;
    return options;
}

export function logout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("profileImageUrl");
    localStorage.removeItem("token");

    // 로그인 페이지로 리다이렉트
    window.location.href = 'login.html';
}

export async function manageLoginStatus() {
    const isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
        //window.location.href = 'login.html';
        return;
    }

    // 토큰 유효성 검사
    if (!isTokenValid()) {
        console.log("인증 토큰이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        return;
    }

    await loadCurrUserProfile();
}

export function handleLoginSuccess(response) {
    // 응답에서 필요한 정보 추출
    const { userId, profileImageUrl, token } = response.data;
    console.log(userId, profileImageUrl, token);
    // 로컬 스토리지에 저장
    localStorage.setItem('userId', userId);
    localStorage.setItem('profileImageUrl', profileImageUrl || "default-profile.jpg");
    localStorage.setItem('token', token);

    window.location.href = 'list.html';
}



function setDropDown() {
    const profileImage = document.getElementById('curr_user_profile_image');
    const profileDropdown = document.querySelector('.profile-dropdown');

    profileImage.addEventListener('click', function (e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    document.addEventListener('click', function () {
        profileDropdown.classList.remove('active');
    });
}