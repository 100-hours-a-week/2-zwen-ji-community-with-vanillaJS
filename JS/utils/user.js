// 유틸리티 함수
export function getCurrentUser() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo;
}

export function getCurrentUserId() {
    const userInfo = getCurrentUser();
    return userInfo.userId || null;
}

// 로컬 테스트를 위한 mock 데이터
export function setupMockUser() {
    const mockUserInfo = {
        userId: 77,
        userEmail: "jijohn.vega@gmail.com",
        userNickname: "zwen",
        userProfileImage: `https://i.namu.wiki/i/O60IuqQY8y1v6uBdOnVa3cHbVYtNzgU_qpxhHgCWrn3bn_vfsOQivI9FtTYBWqxMqmMkwsD0RdnfR37V8T2Hhw.webp`
    };

    // 로컬 스토리지에 저장
    localStorage.setItem('userInfo', JSON.stringify(mockUserInfo));

    return mockUserInfo;
}

// 사용자 정보 업데이트 함수
export function updateUserInfo(updatedInfo) {
    const currentInfo = getCurrentUser();
    const newInfo = { ...currentInfo, ...updatedInfo };
    localStorage.setItem('userInfo', JSON.stringify(newInfo));
    return newInfo;
}