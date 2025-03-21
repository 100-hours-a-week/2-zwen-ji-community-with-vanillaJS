import { addAuthHeader } from "../utils/login.js";

const baseUrl = "http://localhost:8080"

// GET comment ================================
export async function fetchComment(postId) {
    try {
        const options = addAuthHeader({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await fetch(`${baseUrl}/posts/${postId}`, options);
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 데이터 가져오기 오류:', error);
        throw error;
    }
}


// POST Create Comment ================================
export async function createComment(commentData) {
    try {
        const options = addAuthHeader({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        const response = await fetch(`${baseUrl}/comments`, options);

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('댓글 생성 오류:', error);
        throw error;
    }
}

//PUT Edit Comment ==============================
export async function updateComment(commentId, commentData) {
    try {
        const options = addAuthHeader({
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        const response = await fetch(`${baseUrl}/comments/${commentId}`, options);

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 수정  오류:', error);
        throw error;
    }
}



// DELETE comment ===============================
export async function deleteComment(commentId) {
    try {
        const options = addAuthHeader({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const response = await fetch(`${baseUrl}/comments/${commentId}`, options);

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        throw error;
    }
}