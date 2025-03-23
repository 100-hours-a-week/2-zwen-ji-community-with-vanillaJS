import { fetchPostList } from "../../api/post_api.js";
import { formatDateTime } from "../../utils/date-utils.js";
import { loadUserProfile } from "../../utils/login.js";
import { formatNumber } from "../../utils/number_format.js";
import { InfiniteScroll } from "./infinite_scroll.js";


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
                    <div>좋아요 ${formatNumber(postInfo.likesCount)}</div>
                    <div>댓글 ${formatNumber(postInfo.commentsCount)}</div>
                    <div>조회수 ${formatNumber(postInfo.viewsCount)}</div>
                    <span class="datetime">${formatDateTime(postInfo.createdAt)}</span>
                </div>
            </div>
            <div class="user-info">
            <div class="author-profile">
                    <img>
                </div>
                <span class="user-nickname">${postInfo.authorNickname}</span>
            </div>
        </a>`;

        container.appendChild(postElement);

        const profileUrl = `${postInfo.authorProfileImageUrl == "default_image" || postInfo.authorProfileImageUrl == null ? "/static.upload/profiles/default_profile.jpg" : postInfo.authorProfileImageUrl}`;
        loadUserProfile(profileUrl, postElement.querySelector(".author-profile img"))
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