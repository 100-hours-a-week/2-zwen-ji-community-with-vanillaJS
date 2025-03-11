import { formatDateTime } from "../utils/date-utils.js";
import { formatNumber } from "../utils/number_format.js";

export async function fetchPostList(page = 1, limit = 5) {
    const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// export async function loadPostListData() {
//     try {
//         const result = await fetchPostList();

//         if (result.status === 'success') {
//             renderPostList(result.data);
//             return result.data;
//         } else {
//             console.error('API 오류:', result);
//             return null;
//         }
//     } catch (error) {
//         console.error('게시글 목록 로드 오류:', error);
//         return null;
//     }
// }


// function renderPostList(postList) {
//     const postContainer = document.querySelector(".post-group");
//     if (!postContainer) return;

//     postContainer.innerHTML = '';
//     postList.forEach(postInfo => {
//         const postElement = document.createElement('article');
//         postElement.className = 'post-container';
//         postElement.dataset.postId = postInfo.id;

//         postElement.innerHTML = `<a href="post.html?id=${postInfo.id}">
//                         <div class="info-wrap">
//                             <h1>${postInfo.title}</h1>
//                             <div class="post-detail">
//                                 <div> 좋아요 ${formatNumber(postInfo.numLiked)}</div>
//                                 <div>댓글 ${formatNumber(postInfo.numComments)}</div>
//                                 <div>조회수 ${formatNumber(postInfo.numViewed)}</div>
//                                 <span class="datetime">${formatDateTime(postInfo.createdAt)}</span>
//                             </div>
//                         </div>
//                         <div class="user-info">
//                             <div class="svg-container">
//                                 <svg>
//                                     <ellipse></ellipse>
//                                 </svg>
//                             </div>
//                             <span class="user-nickname">${postInfo.nickname}</span>
//                         </div>
//                     </a>`;
//         postContainer.appendChild(postElement);
//     });
// }

export function initListModule() {
    new InfiniteScroll({
        container: '.post-group',
        loadingElement: '#loading-spinner',
        sentinel: '#scroll-sentinel',
        fetchUrl: '/api/posts'
    });
}

function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}
class InfiniteScroll {
    constructor(options) {
        this.options = {
            container: '.post-group',
            loadingElement: '#loading-spinner',
            sentinel: '#scroll-sentinel',
            threshold: 0.1,
            throttleDelay: 300,
            fetchUrl: '/api/posts',
            itemsPerPage: 5,
            ...options
        };

        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreData = true;

        this.init();
    }

    /**
     * 초기화 함수
     */


    init() {
        this.container = document.querySelector(this.options.container);
        this.loadingElement = document.querySelector(this.options.loadingElement);
        this.sentinel = document.querySelector(this.options.sentinel);

        if (!this.container || !this.sentinel) {
            console.error('필요한 DOM 요소를 찾을 수 없습니다.');
            return;
        }

        // 첫 페이지는 컨테이너를 비우고 로드
        this.container.innerHTML = '';

        // 첫 데이터 로드
        this.loadData();

        // 인터섹션 옵저버 설정
        this.setupIntersectionObserver();

    }

    /**
     * 인터섹션 옵저버 설정
     */
    setupIntersectionObserver() {
        // 쓰로틀링된 콜백 함수 생성
        const throttledCallback = throttle(entries => {
            if (entries[0].isIntersecting && !this.isLoading && this.hasMoreData) {
                this.loadData();
            }
        }, this.options.throttleDelay);

        // 인터섹션 옵저버 생성
        const observer = new IntersectionObserver(entries => {
            throttledCallback(entries);
        }, { threshold: this.options.threshold });

        // 감지 요소 관찰 시작
        observer.observe(this.sentinel);
    }

    /**
     * 로딩 스피너 표시/숨김
     * @param {boolean} show - 표시 여부
     */
    toggleLoading(show) {
        if (this.loadingElement) {
            this.loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * 데이터 로드 함수
     */
    async loadData() {
        if (this.isLoading || !this.hasMoreData) return;

        this.isLoading = true;
        this.toggleLoading(true);
        try {
            const result = await fetchPostList(this.currentPage, this.options.itemsPerPage);

            // 받아온 데이터가 없거나 빈 배열이면 더 이상 데이터가 없는 것으로 간주
            if (!result || result.status !== 'success' || !result.data || result.data.length === 0) {
                this.hasMoreData = false;
                this.showEndMessage();
            } else {
                // 데이터 렌더링
                this.renderItems(result.data);
                this.currentPage++;
            }
        } catch (error) {
            console.error('데이터 로드 오류:', error);
        } finally {
            this.isLoading = false;
            this.toggleLoading(false);
        }
    }

    /**
     * 아이템 렌더링 함수 - 기존 renderPostList 함수 스타일 유지
     * @param {Array} postList - 렌더링할 게시글 배열
     */
    renderItems(postList) {
        if (!this.container) return;

        postList.forEach(postInfo => {
            const postElement = document.createElement('article');
            postElement.className = 'post-container';
            postElement.dataset.postId = postInfo.id;

            postElement.innerHTML = `<a href="post.html?id=${postInfo.id}">
                        <div class="info-wrap">
                            <h1>${postInfo.title}</h1>
                            <div class="post-detail">
                                <div> 좋아요 ${formatNumber(postInfo.numLiked)}</div>
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
                            <span class="user-nickname">${postInfo.nickname}</span>
                        </div>
                    </a>`;

            this.container.appendChild(postElement);
        });
    }

    /**
     * 더 이상 데이터가 없을 때 메시지 표시
     */
    showEndMessage() {
        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.textContent = '더 이상 표시할 항목이 없습니다.';
        this.container.appendChild(endMessage);
    }
}
