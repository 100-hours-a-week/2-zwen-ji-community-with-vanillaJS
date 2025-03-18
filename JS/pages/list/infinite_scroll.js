export class InfiniteScroll {
    constructor(options) {
        const defaultOptions = {
            container: null,
            sentinel: '#scroll-sentinel',
            loadingElement: '#loading-spinner',
            threshold: 0.1,
            throttleDelay: 300,
            itemsPerPage: 5,
            startPage: 1,
            showEndMessage: true,
            fetchDataCallback: null,
            renderCallback: null
        };

        this.options = { ...defaultOptions, ...options };

        if (!this.options.container) {
            throw new Error('container 옵션은 필수입니다.');
        }

        this.currentPage = this.options.startPage;
        this.isLoading = false;
        this.hasMoreData = true;

        this.init();
    }

    init() {
        // DOM 요소 찾기
        this.container = document.querySelector(this.options.container);
        this.sentinel = document.querySelector(this.options.sentinel);
        this.loadingElement = this.options.loadingElement ?
            document.querySelector(this.options.loadingElement) : null;

        if (!this.container || !this.sentinel) {
            console.error('필요한 DOM 요소를 찾을 수 없습니다.');
            return;
        }

        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        // 쓰로틀링된 콜백 함수 생성
        const throttledCallback = this.throttle(entries => {
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

        // 클린업을 위해 옵저버 저장
        this.observer = observer;
    }


    async loadData() {
        if (this.isLoading || !this.hasMoreData) return;

        this.isLoading = true;
        this.showLoading();

        try {
            // 외부 데이터 가져오기 콜백 사용
            if (typeof this.options.fetchDataCallback === 'function') {
                const result = await this.options.fetchDataCallback(this.currentPage, this.options.itemsPerPage);

                // 데이터 처리
                if (result && Array.isArray(result.data)) {
                    const items = result.data;

                    // 더 이상 데이터가 없는 경우
                    if (!items.length) {
                        this.hasMoreData = false;
                        this.showEndMessage();
                    } else {
                        // 렌더링 콜백 함수 호출
                        if (typeof this.options.renderCallback === 'function') {
                            this.options.renderCallback(this.container, items);
                        } else {
                            console.warn('renderCallback이 설정되지 않았습니다.');
                        }

                        this.currentPage++;
                    }
                } else if (result && result.message && result.message.includes('성공') && result.data && result.data.posts) {
                    // 이전 API 응답 구조 호환성 유지
                    const posts = result.data.posts;

                    if (!posts.length) {
                        this.hasMoreData = false;
                        this.showEndMessage();
                    } else {
                        // 렌더링 콜백 함수 호출
                        if (typeof this.options.renderCallback === 'function') {
                            this.options.renderCallback(this.container, posts);
                        } else {
                            console.warn('renderCallback이 설정되지 않았습니다.');
                        }

                        this.currentPage++;
                    }
                } else {
                    this.hasMoreData = false;
                    console.error('API 응답 형식 오류:', result);
                    this.showErrorMessage('서버 응답 형식이 올바르지 않습니다.');
                }
            } else {
                console.error('fetchDataCallback이 설정되지 않았습니다.');
                this.showErrorMessage('데이터를 불러오는 함수가 설정되지 않았습니다.');
            }
        } catch (error) {
            console.error('무한 스크롤 데이터 로드 오류:', error);
            this.showErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            this.hideLoading();
            this.isLoading = false;
        }
    }

    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    showEndMessage() {
        if (this.options.showEndMessage === false) return;

        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.textContent = '더 이상 표시할 항목이 없습니다.';
        this.container.appendChild(endMessage);
    }

    showErrorMessage(errorText) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = errorText || '콘텐츠를 로드하는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.';
        this.container.appendChild(errorMessage);
    }

    throttle(func, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }

    destroy() {
        if (this.observer && this.sentinel) {
            this.observer.unobserve(this.sentinel);
        }
    }
}