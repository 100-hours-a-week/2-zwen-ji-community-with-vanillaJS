import { formatDateTime } from '../../utils/date-utils.js';
import { ModalManager } from '../../utils/modal.js';
import { formatNumber } from '../../utils/number_format.js';
import { getCurrentUserId } from '../../utils/user.js';
import { deleteComment } from './comment.js';
import { fetchPost } from '../../api/post_api.js';

const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postDate = document.getElementById('post-date');
const postImage = document.getElementById('post-image');
const likesCountField = document.getElementById('liked-info');
const viewsCountField = document.getElementById('view-count');
const commentsCountField = document.getElementById('comment-count');
const likedBox = document.getElementById('liked-box');


const devTest = true;


function renderPostData(data) {
    const { postId, title, content, imageUrl, authorId, authorNickname, authorProfileImageUrl, likesCount, viewsCount, commentsCount, createdAt, meLiked, comments } = data;

    if (postTitle) postTitle.textContent = title;
    if (postContent) postContent.textContent = content;
    if (postAuthor) postAuthor.textContent = authorNickname;
    if (postDate) {
        const date = new Date(createdAt);
        postDate.textContent = formatDateTime(date);
    }

    if (postImage) {
        if (image) {
            postImage.src = URL.createObjectURL(image);
            postImage.style.display = 'block';
        } else {
            postImage.style.display = 'none';
        }
    }

    if (likesCountField) likesCountField.textContent = formatNumber(likesCount);
    if (viewsCountField) viewsCountField.textContent = formatNumber(viewsCount);
    if (commentsCountField) commentsCountField.textContent = formatNumber(commentsCount);


    renderComments(comments.comment, comments.totalComments);
}



export function renderComments(comments, total) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.commentId = comment.id;

        commentElement.innerHTML = `
        <div class="writer-info">
            <div class="svg-container">
                ${comment.authorProfileImage ? '<img src="${comment.authorProfileImage}">' : '<svg><ellipse></ellipse></svg>'}
            </div>
            <div class="user-nickname">${comment.authorNickname}</div>
        </div>
        <div class="datetime">${formatDateTime(new Date(comment.createdAt))}</div>
        <div class="comment-content">${comment.content}</div>
        ${comment.authorUserId == getCurrentUserId() || devTest ? `
        <div class="button-group">
            <button class="button-type4 btn-edit-comment">수정</button>
            <button class="button-type4 btn-delete-comment">삭제</button>
        </div>` : ''}
      `;
        if (comment.authorUserId == getCurrentUserId() || devTest) {
            commentElement.querySelector('.btn-edit-comment').addEventListener('click', () => {
                //TODO
                console.log("댓글 수정 처리 로직", comment.id);
            });
            new ModalManager({
                trigger: commentElement.querySelector('.btn-delete-comment'),
                callback: async () => { deleteComment(comment.id) },
                mainText: '댓글을 삭제하시겠습니까?',
                subText: '삭제된 게시글은 복구할 수 없습니다.'
            })
        }
        commentsList.appendChild(commentElement);
    });
    //setupCommentDeleteButtons(postId);
}

// Entry Point ========================================
export async function initPostModule(postId) {
    try {
        const result = await fetchPost(postId);
        renderPostData(result.data);
        // if (result.status === 'success') {
        //     renderPostData(result.data);
        //     return result.data;
        // } else {
        //     console.error('API 오류:', result);
        //     return null;
        // }

        if (result.data.authorId == getCurrentUserId() || devTest) {
            document.querySelector(".button-group").setAttribute("style", "display:inline-block");
            document.getElementById('btn_post_edit').addEventListener('click', () => {
                window.location.href = `./post_edit.html?id=${postId}`;
            });

            const postDeleteModal = new ModalManager({
                trigger: document.getElementById('btn_post_delete'),
                callback: async () => { deletePost(postId) },
                mainText: '게시글을 삭제하시겠습니까?',
                subText: '삭제된 게시글은 복구할 수 없습니다.'
            });
            console.log("게시물 삭제 이벤트리스너 등록");
        }
    } catch (error) {
        console.error('게시글 페이지 로드 오류:', error);
        return null;
    }

}


async function deletePost(postId) {
    console.log('게시글 삭제 API 호출', postId);
    // try {
    //     // 게시글 삭제 API 호출
    //     const response = await fetch(`/api/posts/${postId}`, {
    //         method: 'DELETE'
    //     });
    //     if (response.ok) {
    //         window.location.href = '/posts';
    //     } else {
    //         console.log('게시글 삭제에 실패했습니다.');
    //     }
    // } catch (error) {
    //     console.error('게시글 삭제 오류:', error);
    // }
}
