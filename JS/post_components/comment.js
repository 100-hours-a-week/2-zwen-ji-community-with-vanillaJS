import { formatDateTime } from "../utils/date-utils.js";
import { getCurrentUserId } from "../utils/user.js";
import { setupCommentDeleteButtons } from "./modal.js";
const commentsList = document.getElementById('comments-list');

export async function fetchComment(postId) {
    const response = await fetch(`/api/post/${postId}/comment`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

export async function loadCommentData(postId) {
    try {
        const result = await fetchComment(postId);
        console.log(result.data);
        if (result.status === 'success') {
            renderComments(result.data.comments, postId);
            return result.data;
        } else {
            console.error('API 오류:', result);
            return null;
        }
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        return null;
    }
}

export function renderComments(comments, postId) {
    const commentCount = document.getElementById('comment-count');
    if (!commentsList) return;

    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.id; // id를 data 속성으로 저장

        commentElement.innerHTML = `
        <div class="writer-info">
            <div class="svg-container">
                ${comment.authorProfileImage ? '<img src="${comment.authorProfileImage}">' : '<svg><ellipse></ellipse></svg>'}
            </div>
            <div class="user-nickname">${comment.authorNickname}</div>
        </div>
        <div class="datetime">${formatDateTime(new Date(comment.createdAt))}</div>
        <div class="comment-content">${comment.body}</div>
        ${comment.authorUserId == getCurrentUserId() ? `
        <div class="button-group">
            <button class="button-type4 btn-edit-comment">수정</button>
            <button class="button-type4 btn-delete-comment">삭제</button>
        </div>` : ''}
      `;
        commentsList.appendChild(commentElement);
    });
    setupCommentDeleteButtons(postId);
}

// 댓글 POST ==================================
export async function postComment(postId, commentData) {
    const response = await fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// 댓글 삭제 API 함수
export async function deleteComment(postId, commentId) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        throw error;
    }
}


// Entry Point ========================================
export function initCommentModule(postId) {
    // 업로드 버튼 이벤트 등록
    const commentAdd = document.getElementById('btn_comment_upload');
    const commentInput = document.getElementById('comment-input');

    if (commentAdd) {
        commentAdd.addEventListener('click', async () => {
            try {
                const commentText = commentInput ? commentInput.value.trim() : '';
                if (!commentText) {
                    return;
                }

                const commentData = {
                    body: commentText
                };

                const result = await postComment(postId, commentData);

                if (result.status === 'success') {
                    if (commentInput) {
                        commentInput.value = '';
                    }
                    await loadCommentData(postId);
                } else {
                    console.error('API 오류:', result);
                }
            } catch (error) {
                console.error('댓글 작성 오류:', error);
            }
        });
    }
    return;
}