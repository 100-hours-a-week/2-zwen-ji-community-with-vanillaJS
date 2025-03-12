import { formatDateTime } from '../utils/date-utils.js';
import { formatNumber } from '../utils/number_format.js';
import { renderComments } from './comment.js';
const postTitle = document.getElementById('post-title');
const postBody = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postDate = document.getElementById('post-date');
const postImage = document.getElementById('post-image');
const likeCount = document.getElementById('liked-info');
const viewCount = document.getElementById('view-count');
const likedBox = document.getElementById('liked-box');

export async function fetchPost(postId) {
    // TODO
    // const response = await fetch(`/api/posts/${postId}`);
    // if (!response.ok) {
    //     throw new Error(`HTTP 오류: ${response.status}`);
    // }
    // return await response.json();
    return GET_post;
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

function renderPostData(data) {
    const { postId, title, body, authorNickname, image, numLiked, numViewed, numComments, createdAt, meLiked, comments } = data;

    if (postTitle) postTitle.textContent = title;
    if (postBody) postBody.textContent = body;
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

    if (likeCount) likeCount.textContent = formatNumber(numLiked);
    if (viewCount) viewCount.textContent = formatNumber(numViewed);

    // Liked =======================================
    const liked = {
        isLiked: meLiked,
        num: numLiked,

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
            likeCount.textContent = formatNumber(this.num);
        }
    }

    if (meLiked) {
        likedBox.classList.add('active');
    } else {
        likedBox.classList.remove('active');
    }
    likeCount.textContent = liked.num;

    if (likedBox) {
        likedBox.addEventListener('click', () => {
            liked.updateCurrentState();
        })
    }

    // Comments =====================================
    renderComments(comments, postId);
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



// Entry Point ========================================
export function initPostModule(postId) {
    document.getElementById('btn_post_edit').addEventListener('click', () => {
        window.location.href = `./post_edit.html?id=${postId}`;
    });
    return loadPostData(postId);
}



// Remove Later
// Mock JSON ===========================================
const GET_post = {
    "status": "success",
    "data": {
        "postId": 10001,
        "title": "React Hooks를 활용한 상태 관리 최적화",
        "body": "오늘은 React의 useState와 useEffect를 사용하여 컴포넌트 상태를 효율적으로 관리하는 방법에 대해 알아보겠습니다. 많은 개발자들이 이 부분에서 실수하는 패턴들과 이를 개선할 수 있는 방법을 코드 예제와 함께 설명하겠습니다.",
        "image": "https://example.com/images/react-hooks-post.jpg",
        "authorUserId": 21,
        "authorNickname": "코드마스터",
        "authorProfileImage": "https://example.com/profiles/codemaster.jpg",
        "numLiked": 13,
        "numViewed": 181,
        "numComments": 4,
        "createdAt": "2024-02-24T10:00:00Z",
        "updatedAt": "2024-02-24T10:00:00Z",
        "comments": [
            {
                "commentId": 1,
                "body": "정말 유용한 글이네요! useCallback과 useMemo에 대한 글도 부탁드립니다.",
                "authorUserId": 20,
                "authorNickname": "리액트러버",
                "authorProfileImage": "https://example.com/profiles/reactlover.jpg",
                "createdAt": "2024-02-24T10:30:00Z",
                "updatedAt": "2024-02-24T10:30:00Z"
            },
            {
                "commentId": 2,
                "body": "예제 코드가 정말 이해하기 쉽게 작성되어 있어요. 실무에서 바로 적용해볼 수 있을 것 같습니다.",
                "authorUserId": 34,
                "authorNickname": "프론트엔드개발자",
                "authorProfileImage": "https://example.com/profiles/frontenddev.jpg",
                "createdAt": "2024-02-24T11:15:00Z",
                "updatedAt": "2024-02-24T11:15:00Z"
            },
            {
                "commentId": 3,
                "body": "저는 Redux를 주로 사용하는데, 이 방식과 어떻게 비교될까요?",
                "authorUserId": 42,
                "authorNickname": "리덕스마스터",
                "authorProfileImage": "https://example.com/profiles/reduxmaster.jpg",
                "createdAt": "2024-02-24T14:20:00Z",
                "updatedAt": "2024-02-24T14:20:00Z"
            },
            {
                "commentId": 4,
                "body": "클래스 컴포넌트와 함수형 컴포넌트의 성능 차이에 대한 벤치마크 결과도 공유해주시면 좋을 것 같아요.",
                "authorUserId": 18,
                "authorNickname": "퍼포먼스헌터",
                "authorProfileImage": "https://example.com/profiles/perfhunter.jpg",
                "createdAt": "2024-02-24T16:45:00Z",
                "updatedAt": "2024-02-24T16:45:00Z"
            }
        ],
        "commentsMeta": {
            "totalComments": 4,
            "currentPage": 1,
            "totalPages": 1,
            "hasMoreComments": false
        }
    }
}