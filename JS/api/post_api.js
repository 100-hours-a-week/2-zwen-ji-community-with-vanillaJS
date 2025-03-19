import { addAuthHeader } from '../utils/login.js';

const baseUrl = "http://localhost:8080"
// GET Post List ================================
export async function fetchPostList(page = 1, limit = 5) {
    try {

        const options = addAuthHeader({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await fetch(`${baseUrl}/posts?page=${page}&limit=${limit}`, options);
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('게시물 목록 가져오기 오류:', error);
        throw error;
    }
}


//GET Post Detail ===============================
export async function fetchPost(postId) {
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
        console.error('게시물 가져오기 오류:', error);
        throw error;
    }
}


// POST Create Post =============================
export async function createPost(formData) {
    try {
        const options = addAuthHeader({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const response = await fetch(`${baseUrl}/posts`, options);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('상세 오류:', errorBody);
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('게시물 생성 오류:', error);
        throw error;
    }
}


// PATCH Post ================================


// DELETE Post =================================
export async function deletePost(postId) {
    console.log('게시글 삭제 API 호출', postId);
    try {
        // 게시글 삭제 API 호출
        const options = addAuthHeader({
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await fetch(`/posts/${postId}`, options);
        if (response.ok) {
            window.location.href = '/posts';
        } else {
            console.log('게시글 삭제에 실패했습니다.');
        }
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
    }
}

