import { addAuthHeader } from "../utils/login.js";

const baseUrl = "http://localhost:8080"

// POST Create Liked ==================================
export async function createLiked(postId) {
    try {
        const options = addAuthHeader({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const response = await fetch(`${baseUrl}/likes/${postId}`, options);

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('좋아요 추가 오류:', error);
        throw error;
    }
}


//DELETE Liked ======================================
export async function deleteLiked(postId) {
    try {
        const options = addAuthHeader({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const response = await fetch(`${baseUrl}/likes/${postId}`, options);

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('좋아요 삭제 오류:', error);
        throw error;
    }
}