import { InfiniteScroll } from "./infinite_scroll.js";

// API 호출 함수
export async function fetchPostList(page = 1, limit = 5) {
    const response = await fetch(`http://localhost:8080/api/posts/page/${page}/limit/${limit}`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// 게시물 렌더링 함수 (재사용 가능)
export function renderPostItems(container, postList) {
    if (!container) return;

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

        container.appendChild(postElement);
    });
}

// 초기 데이터 로드 함수
// 초기 데이터 로드 함수
export async function initialLoad(containerSelector) {
    try {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('컨테이너 요소를 찾을 수 없습니다:', containerSelector);
            return null;
        }

        // 로딩 인디케이터 표시
        const loadingSpinner = document.querySelector('#loading-spinner');
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        // 첫 페이지 데이터 로드
        const result = await fetchPostList(1, 5);

        // 로딩 인디케이터 숨기기
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        // 서버 응답 구조에 맞게 처리
        if (result && result.message && result.message.includes('성공') && result.data && result.data.posts) {
            // 컨테이너 초기화 후 데이터 렌더링
            container.innerHTML = '';
            renderPostItems(container, result.data.posts);
            return result.data;
        } else {
            console.error('API 오류 또는 데이터 없음:', result);
            showNoDataMessage(container);
            return null;
        }
    } catch (error) {
        console.error('초기 데이터 로드 오류:', error);
        const container = document.querySelector(containerSelector);
        if (container) showErrorMessage(container, '데이터를 불러오는 중 오류가 발생했습니다.');

        // 로딩 인디케이터 숨기기
        const loadingSpinner = document.querySelector('#loading-spinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        return null;
    }
}

// 무한 스크롤의 loadData 메소드에 적용할 부분
async function loadData() {
    if (this.isLoading || !this.hasMoreData) return;

    this.isLoading = true;
    this.showLoading();

    try {
        const result = await fetchPostList(this.currentPage, this.options.itemsPerPage);

        // 서버 응답 구조에 맞게 처리
        if (result && result.message && result.message.includes('성공') && result.data && result.data.posts) {
            // 게시물이 없거나 빈 배열이면 더 이상 데이터가 없는 것으로 간주
            if (!result.data.posts.length) {
                this.hasMoreData = false;
                this.showEndMessage();
            } else {
                // 여기서 외부 렌더링 함수를 사용
                renderPostItems(this.container, result.data.posts);
                this.currentPage++;
            }
        } else {
            this.hasMoreData = false;
            console.error('API 응답 형식 오류:', result);
            this.showErrorMessage('서버 응답 형식이 올바르지 않습니다.');
        }
    } catch (error) {
        console.error('무한 스크롤 데이터 로드 오류:', error);
        this.showErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
        this.hideLoading();
        this.isLoading = false;
    }
}

// 오류 메시지 표시
function showErrorMessage(container, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message || '데이터를 불러오는 중 오류가 발생했습니다.';
    container.appendChild(errorElement);
}

// 데이터 없음 메시지 표시
function showNoDataMessage(container) {
    const noDataElement = document.createElement('div');
    noDataElement.className = 'no-data-message';
    noDataElement.textContent = '표시할 게시물이 없습니다.';
    container.appendChild(noDataElement);
}

// Entry Point - 모듈 초기화
export async function initListModule() {
    // 1. 먼저 초기 데이터를 로드하고 렌더링
    const initialData = await initialLoad('.post-group');

    // 초기 데이터가 없으면 무한 스크롤을 설정하지 않음
    if (!initialData) return null;

    // 2. 무한 스크롤 설정
    const listInfiniteScroll = new InfiniteScroll({
        container: '.post-group',
        loadingElement: '#loading-spinner',
        sentinel: '#scroll-sentinel',
        itemsPerPage: 5,
        startPage: 2  // 첫 페이지는 이미 로드했으므로 2페이지부터 시작
    });

    // 무한 스크롤의 loadData 메소드 오버라이드
    listInfiniteScroll.loadData = async function () {
        if (this.isLoading || !this.hasMoreData) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const result = await fetchPostList(this.currentPage, this.options.itemsPerPage);

            if (!result || result.status !== 'success' || !result.data || result.data.length === 0) {
                this.hasMoreData = false;
                this.showEndMessage();
            } else {
                // 여기서 외부 렌더링 함수를 사용
                renderPostItems(this.container, result.data);
                this.currentPage++;
            }
        } catch (error) {
            console.error('무한 스크롤 데이터 로드 오류:', error);
            this.showErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
            this.isLoading = false;
        }
    };

    return listInfiniteScroll;
}

// 유틸리티 함수들
function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('ko-KR');
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return '';

    try {
        const date = new Date(dateTimeStr);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('날짜 형식 변환 오류:', e);
        return dateTimeStr;
    }
}