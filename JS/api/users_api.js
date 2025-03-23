import { addAuthHeader } from '../utils/login.js';

const baseUrl = "http://localhost:8080"
// GET User ================================
export async function fetchUser(userId) {
    try {
        const options = addAuthHeader({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await fetch(`${baseUrl}/users/${userId}`, options);
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('사용자 정보 가져오기 오류:', error);
        throw error;
    }
}

// PATCH User
export async function updateNickname(userId, nickname) {
    try {
        if (!nickname) {
            throw new Error("닉네임이 제공되지 않았습니다");
        }

        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ nickname })
        };

        const response = await fetch(`${baseUrl}/users/${userId}/nickname`, options);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "닉네임 변경 중 오류가 발생했습니다";

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error("오류 응답 파싱 실패:", e);
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('닉네임 변경 오류:', error);
        throw error;
    }
}

// POST Profile Image
export async function uploadProfileImage(userId, imageFile) {
    try {
        if (!imageFile) {
            throw new Error("이미지 파일이 제공되지 않았습니다");
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        };

        const response = await fetch(`${baseUrl}/users/${userId}/profile-image`, options);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "프로필 이미지 업로드 중 오류가 발생했습니다";

            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error("오류 응답 파싱 실패:", e);
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('프로필 이미지 업로드 오류:', error);
        throw error;
    }
}


// DELETE User 
export async function deleteUser(userId) {
    try {

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        };
        const response = await fetch(`${baseUrl}/users/${userId}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "회원 탈퇴 처리 중 오류가 발생했습니다");
        }
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error('회원 탈퇴 오류:', error);
        throw error;
    }
}


// PATCH Password
export async function updatePassword(newPassword) {
    try {
        const userId = localStorage.getItem('userId');


        const options = addAuthHeader({
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword: newPassword })
        });


        const response = await fetch(`${baseUrl}/users/${userId}/password`, options);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '비밀번호 변경에 실패했습니다.');
        }

        return data;
    } catch (error) {
        console.error('비밀번호 변경 API 오류:', error);
        throw error;
    }
}