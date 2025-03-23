// 유틸리티 함수
export function getCurrentUser() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo;
}

export function getCurrentUserId() {
    const userId = localStorage.getItem('userId');
    return userId || null;
}

// 사용자 정보 업데이트 함수
export function updateUserInfo(updatedInfo) {
    const currentInfo = getCurrentUser();
    const newInfo = { ...currentInfo, ...updatedInfo };
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
    return newInfo;
}


