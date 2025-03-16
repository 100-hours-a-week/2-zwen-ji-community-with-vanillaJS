export class InfiniteScroll {
    constructor(options) {
        // 기본 옵션 설정
        const defaultOptions = {
            container: null,
            sentinel: '#scroll-sentinel',
            loadingElement: '#loading-spinner',
            threshold: 0.1,
            throttleDelay: 300,
            fetchUrl: null,
            itemsPerPage: 5
        };

        // 사용자 옵션과 기본 옵션 병합
        this.options = { ...defaultOptions, ...options };

        // 필수 옵션 검증
        if (!this.options.container) {
            throw new Error('container 옵션은 필수입니다.');
        }

        this.currentPage = 1;
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

        // 필수 요소 확인
        if (!this.container || !this.sentinel) {
            console.error('필요한 DOM 요소를 찾을 수 없습니다.');
            return;
        }

        // 인터섹션 옵저버 설정
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

    // 기본 loadData 메소드 (오버라이드 가능)
    async loadData() {
        if (this.isLoading || !this.hasMoreData) return;

        this.isLoading = true;
        this.showLoading();

        try {
            // 실제 구현은 이 메소드를 오버라이드하여 사용
            console.warn('loadData 메소드를 오버라이드해야 합니다.');

            // 기본 동작: 페이지 증가 (실제 데이터 로드는 오버라이드에서 구현)
            this.currentPage++;
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            this.showErrorMessage(error);
        } finally {
            this.hideLoading();
            this.isLoading = false;
        }
    }

    // 기본 renderPostItems 메소드 (오버라이드 가능)
    renderPostItems(items) {
        console.warn('renderPostItems 메소드를 오버라이드해야 합니다.');
        // 실제 구현은 이 메소드를 오버라이드하여 사용
    }

    // 로딩 인디케이터 표시
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
    }

    // 로딩 인디케이터 숨기기
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    // 더 이상 데이터가 없을 때 메시지 표시
    showEndMessage() {
        if (this.options.showEndMessage === false) return;

        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.textContent = '더 이상 표시할 항목이 없습니다.';
        this.container.appendChild(endMessage);
    }

    // 오류 메시지 표시
    showErrorMessage(error) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = '콘텐츠를 로드하는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.';
        this.container.appendChild(errorMessage);
    }

    // 쓰로틀 유틸리티 메소드
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

    // 리소스 정리
    destroy() {
        if (this.observer && this.sentinel) {
            this.observer.unobserve(this.sentinel);
        }
    }
}