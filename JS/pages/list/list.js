import { formatDateTime } from "../../utils/date-utils.js";
import { formatNumber } from "../../utils/number_format.js";
import { InfiniteScroll } from "./infinite_scroll.js";

export async function fetchPostList(page = 1, limit = 5) {
    try {
        const response = await fetch(`http://localhost:8080/posts?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('게시물 목록 가져오기 오류:', error);
        throw error;
    }
}
export function renderPostItems(container, postList) {
    if (!container || !Array.isArray(postList)) return;

    postList.forEach(postInfo => {
        const postElement = document.createElement('article');
        postElement.className = 'post-container';
        postElement.dataset.postId = postInfo.id;

        postElement.innerHTML = `<a href="post.html?id=${postInfo.postId}">
            <div class="info-wrap">
                <h1>${postInfo.title}</h1>
                <div class="post-detail">
                    <div>좋아요 ${formatNumber(postInfo.numLiked)}</div>
                    <div>댓글 ${formatNumber(postInfo.numComments)}</div>
                    <div>조회수 ${formatNumber(postInfo.numViewed)}</div>
                    <span class="datetime">${formatDateTime(postInfo.createdAt)}</span>
                </div>
            </div>
            <div class="user-info">
                <div class="svg-container">
                    <svg>
                        <ellipse></ellipse>
                    </svg>
                </div>
                <span class="user-nickname">${postInfo.authorNickname}</span>
            </div>
        </a>`;

        container.appendChild(postElement);
    });
}

// Entry Point ==========================================================
export async function initListModule() {
    const listInfiniteScroll = new InfiniteScroll({
        container: '.post-group',
        loadingElement: '#loading-spinner',
        sentinel: '#scroll-sentinel',
        itemsPerPage: 5,
        startPage: 1,

        fetchDataCallback: async (page, limit) => {
            const result = await fetchPostList(page, limit);
            return result;
        },
        renderCallback: (container, posts) => {
            renderPostItems(container, posts);
        }
    });

    console.log('무한 스크롤 초기화 완료');
}