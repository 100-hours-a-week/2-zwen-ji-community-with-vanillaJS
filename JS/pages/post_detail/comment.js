import { createComment, deleteComment, fetchComment, updateComment } from "../../api/comments_api.js";
import { formatDateTime } from "../../utils/date-utils.js";
import { ModalManager } from "../../utils/modal.js";
import { getCurrentUserId } from '../../utils/user.js';



export async function loadCommentData(postId) {
    try {
        const result = await fetchComment(postId);
        if (result.status === 'success') {
            renderComments(postId, result.data.comments, postId);
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

export function renderComments(postId, comments, total) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    commentsList.innerHTML = '';
    if (!comments) return;
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.commentId;

        commentElement.innerHTML = `
        <div class="writer-info">
                <img src=${comment.authorProfileImage}>
            <div class="user-nickname">${comment.authorNickname}</div>
        </div>
        <div class="datetime">${formatDateTime(new Date(comment.createdAt))}</div>
        <div class="comment-content">${comment.content}</div>
        ${comment.authorUserId == getCurrentUserId() ? `
        <div class="button-group">
            <button class="button-type4 btn-edit-comment">수정</button>
            <button class="button-type4 btn-delete-comment">삭제</button>
        </div>` : ''}
      `;
        if (comment.authorUserId == getCurrentUserId()) {
            commentElement.querySelector('.btn-edit-comment').addEventListener('click', () => {
                changeToEditMode(comment.content, postId, comment.commentId);
            });
            new ModalManager({
                trigger: commentElement.querySelector('.btn-delete-comment'),
                callback: async () => {
                    const result = await deleteComment(comment.commentId);
                    if (result.status === 'success') {
                        loadCommentData(postId);
                    } else {
                        console.error('API 오류:', result);
                    }
                },
                mainText: '댓글을 삭제하시겠습니까?',
                subText: '삭제된 게시글은 복구할 수 없습니다.'
            })
        }
        commentsList.appendChild(commentElement);
    });
    //setupCommentDeleteButtons(postId);
}

function initCommentEditor(submitButton, commentInput) {
    commentInput.addEventListener("input", () => {
        if (isValidComment(commentInput.value)) {
            console.log("활성화");
            submitButton.disabled = false;
            submitButton.classList.remove('btn-disabled');
            submitButton.classList.add('btn-active');
        }
        else {
            console.log("비활성화");
            submitButton.disabled = true;
            submitButton.classList.remove('btn-active');
            submitButton.classList.add('btn-disabled');
        }
    });
}

function changeToEditMode(content, postId, commentId) {
    const commentInput = document.getElementById('comment-input');
    const submitCreateButton = document.getElementById('btn_comment_upload');
    const submitUpdateButton = document.getElementById('btn_comment_update');

    submitCreateButton.setAttribute("style", "display : none");
    submitUpdateButton.setAttribute("style", "display: block");
    commentInput.value = content;
    initCommentEditor(submitUpdateButton, commentInput);

    const updateHandler = () => {
        console.log("수정 버튼 클릭");
        const commentData = {
            postId: postId,
            content: commentInput.value
        };
        console.log(commentData);
        updateComment(commentId, commentData);
        submitCreateButton.setAttribute("style", "display: block");
        submitUpdateButton.setAttribute("style", "display : none");
        loadCommentData(postId);

        submitUpdateButton.removeEventListener('click', updateHandler);
        commentInput.value = "";
    };
    submitUpdateButton.addEventListener('click', updateHandler);
}
// commentInputField.value = content;


export function isValidComment(content) {
    return content.length > 0;
}

// Entry Point ========================================
export function initCommentModule(postId) {
    const submitButton = document.getElementById('btn_comment_upload');
    const commentInput = document.getElementById("comment-input");
    // 업로드 버튼 이벤트 등록

    if (!submitButton) { return; }
    submitButton.addEventListener('click', () => {
        createCommentHandler(postId, commentInput)
        console.log("등록 버튼 클릭");
    });

    initCommentEditor(submitButton, commentInput);
    return;
}

async function createCommentHandler(postId, commentInput) {
    console.log("댓글 작성 API 호출");
    try {
        const commentText = commentInput ? commentInput.value.trim() : '';
        if (!commentText) {
            return;
        }

        const commentData = {
            content: commentText,
            postId: postId
        };

        const result = await createComment(commentData);

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
}