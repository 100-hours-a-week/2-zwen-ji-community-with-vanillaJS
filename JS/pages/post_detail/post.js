import { deletePost, fetchPost } from '../../api/post_api.js';
import { formatDateTime } from '../../utils/date-utils.js';
import { addAuthHeader, loadUserProfile } from '../../utils/login.js';
import { ModalManager } from '../../utils/modal.js';
import { formatNumber } from '../../utils/number_format.js';
import { getCurrentUserId } from '../../utils/user.js';
import { renderComments } from './comment.js';
import { initLikedMoudule } from './liked.js';

const postTitle = document.getElementById('post-title');
const postContent = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postAuthorProfileImage = document.getElementById('post-author-profile');
const postDate = document.getElementById('post-date');
const postImage = document.getElementById('post-image');
const likesCountField = document.getElementById('liked-info');
const viewsCountField = document.getElementById('view-count');
const commentsCountField = document.getElementById('comment-count');
const likedBox = document.getElementById('liked-box');


function renderPostData(data) {
    const { postId, title, content, imageUrl, authorUserId, authorNickname, authorProfileImageUrl, likesCount, viewsCount, commentsCount, createdAt, likedByCurrentUser, comments } = data;
    if (postTitle) postTitle.textContent = title;
    if (postContent) postContent.textContent = content;

    if (postAuthor) postAuthor.textContent = authorNickname;
    if (postAuthorProfileImage) loadUserProfile(authorProfileImageUrl, postAuthorProfileImage);


    if (postDate) {
        const date = new Date(createdAt);
        postDate.textContent = formatDateTime(date);
    }

    if (postImage) {
        if (imageUrl) {
            loadPostImage(imageUrl, postImage);
            postImage.style.display = 'block';
        } else {
            postImage.style.display = 'none';
        }
    }

    if (likesCountField) likesCountField.textContent = formatNumber(likesCount);
    if (viewsCountField) viewsCountField.textContent = formatNumber(viewsCount);
    if (commentsCountField) commentsCountField.textContent = formatNumber(commentsCount);


    if (comments && Array.isArray(comments)) {
        renderComments(postId, comments, comments.length);
    }
    else {
        console.error('댓글 데이터 형식이 예상과 다릅니다:', data.comments);
    }

    initLikedMoudule(likedByCurrentUser, likesCount, postId);
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

        if (result.data.authorUserId == getCurrentUserId()) {
            document.querySelector(".button-group").setAttribute("style", "display:inline-block");
            document.getElementById('btn_post_edit').addEventListener('click', () => {
                window.location.href = `./post_edit.html?id=${postId}`;
            });

            const postDeleteModal = new ModalManager({
                trigger: document.getElementById('btn_post_delete'),
                callback: async () => {
                    const response = await deletePost(postId);
                    if (response.status == "success") {

                    }
                },
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

function loadPostImage(imageUrl, imageElement) {
    if (!imageUrl || imageUrl === "default_image") {
        // 이미지가 없거나 기본 이미지인 경우 기본 이미지 표시
        imageElement.src = "/path/to/default/image.jpg";
        return;
    }

    fetch(`http://localhost:8080${imageUrl}`, addAuthHeader())
        .then(response => {
            if (!response.ok) {
                throw new Error('Image loading failed');
            }
            return response.blob();
        })
        .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            imageElement.src = objectUrl;
            // 메모리 누수 방지를 위해 이미지 로드 후 URL 해제
            imageElement.onload = () => {
                URL.revokeObjectURL(objectUrl);
            };
        })
        .catch(error => {
            console.error('Error loading image:', error);
            // 에러 발생 시 기본 이미지 표시
            imageElement.src = "/path/to/default/image.jpg";
        });
}