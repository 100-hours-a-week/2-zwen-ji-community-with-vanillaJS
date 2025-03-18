export class ModalManager {
    /**
     * 모달 관리자 생성자
     * @param {Object} options - 모달 설정 옵션
     * @param {HTMLElement} options.trigger - 모달을 열 트리거 버튼 요소
     * @param {number} [options.postId] - 게시글 ID (해당하는 경우)
     * @param {number} [options.commentId] - 댓글 ID (해당하는 경우)
     * @param {Function} options.callback - 확인 버튼 클릭 시 실행할 콜백 함수
     * @param {string} options.mainText - 모달 제목 텍스트
     * @param {string} options.subText - 모달 설명 텍스트
     */
    constructor(options) {
        // 옵션 저장
        this.options = options;

        // DOM 요소 참조
        this.modalOverlay = document.getElementById('modal_overlay');
        this.modalTitle = document.querySelector('.modal-title');
        this.modalSubtitle = document.querySelector('.subtitle');
        this.confirmBtn = document.getElementById('btn_modal_confirm');
        this.cancelBtn = document.getElementById('btn_modal_cancel');

        // 이벤트 핸들러 바인딩
        this.openModal = this.openModal.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);

        // 이벤트 리스너 설정
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 트리거 버튼에 클릭 이벤트 추가
        if (this.options.trigger) {
            this.options.trigger.addEventListener('click', this.openModal);
        }

        // 확인 버튼에 이벤트 추가
        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', this.handleConfirm);
        }

        // 취소 버튼에 이벤트 추가
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', this.closeModal);
        }

        // 오버레이 클릭 이벤트 추가
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', this.handleOverlayClick);
        }
    }

    // 모달 열기
    openModal() {
        if (!this.modalOverlay) return;

        // 모달 텍스트 설정
        if (this.modalTitle) {
            this.modalTitle.textContent = this.options.mainText || '';
        }

        if (this.modalSubtitle) {
            this.modalSubtitle.textContent = this.options.subText || '';
        }

        // 모달 표시
        this.modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }

    // 확인 버튼 클릭 처리
    handleConfirm() {
        // 콜백 함수가 있으면 실행
        if (typeof this.options.callback === 'function') {
            // 필요한 컨텍스트 정보 전달
            this.options.callback({
                postId: this.options.postId,
                commentId: this.options.commentId
            });
        }

        // 모달 닫기
        this.closeModal();
    }

    // 모달 닫기
    closeModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // 스크롤 복원
        }
    }

    // 모달 외부 클릭 처리
    handleOverlayClick(event) {
        if (event.target === this.modalOverlay) {
            this.closeModal();
        }
    }

    // 이벤트 리스너 정리 (필요시 호출)
    destroy() {
        if (this.options.trigger) {
            this.options.trigger.removeEventListener('click', this.openModal);
        }

        if (this.confirmBtn) {
            this.confirmBtn.removeEventListener('click', this.handleConfirm);
        }

        if (this.cancelBtn) {
            this.cancelBtn.removeEventListener('click', this.closeModal);
        }

        if (this.modalOverlay) {
            this.modalOverlay.removeEventListener('click', this.handleOverlayClick);
        }
    }
}