import { formatDateTime } from '../utils/date-utils.js';
import { formatNumber } from '../utils/number_format.js';
const postTitle = document.getElementById('post-title');
const postBody = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postDate = document.getElementById('post-date');
const postImage = document.getElementById('post-image');
const likeCount = document.getElementById('like-info');
const viewCount = document.getElementById('view-count');

const likedInfo = document.getElementById('liked-info');
const likedBox = document.getElementById('liked-box');

export async function fetchPost(postId) {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}


export async function loadPostData(postId) {
    try {
        const result = await fetchPost(postId);

        if (result.status === 'success') {
            renderPostData(result.data);
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

// 게시글 데이터 렌더링
function renderPostData(data) {
    const { title, body, nickname, image, numLiked, numViewed, numComments, createdAt } = data;

    // 게시글 정보 업데이트
    if (postTitle) postTitle.textContent = title;
    if (postBody) postBody.textContent = body;
    if (postAuthor) postAuthor.textContent = nickname;
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

    if (likeCount) likeCount.textContent = formatNumber(numLiked);
    if (viewCount) viewCount.textContent = formatNumber(numViewed);

    const liked = {
        isLiked: false,
        num: 0,
        getCurrentNum() {
            this.num = numLiked;
        },
        updateCurrentState() {
            if (this.isLiked) {
                likedBox.classList.remove('active');
                liked.num -= 1;
                this.isLiked = false;
                console.log("좋아요 취소 API 호출")
            } else {
                likedBox.classList.add('active');
                liked.num += 1;
                this.isLiked = true;
                console.log("좋아요 추가 API 호출")
            }
            likedInfo.textContent = formatNumber(this.num);
        }
    }

    liked.getCurrentNum();
    likedBox.classList.remove('active');
    likedInfo.textContent = liked.num;

    if (likedBox) {
        likedBox.addEventListener('click', () => {
            liked.updateCurrentState();
        })
    }
}

// export async function handlePostDelete(postId) {
//     if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
//         return;
//     }

//     try {
//         const result = await deletePost(postId);

//         if (result.status === 'success') {
//             alert(result.message || '게시글이 삭제되었습니다.');
//             window.location.href = '/';
//         } else {
//             alert('게시글 삭제에 실패했습니다.');
//             console.error('게시글 삭제 오류:', result);
//         }
//     } catch (error) {
//         alert('게시글 삭제 중 오류가 발생했습니다.');
//         console.error('게시글 삭제 오류:', error);
//     }
// }



// 게시글 모듈 초기화
export function initPostModule(postId) {
    document.getElementById('btn_post_edit').addEventListener('click', () => {
        window.location.href = `./post_edit.html?id=${postId}`;
    });
    // 게시글 데이터 로드
    return loadPostData(postId);
}
