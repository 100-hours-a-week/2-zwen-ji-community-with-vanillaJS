export class ModalManager {
    constructor(options) {
        this.options = options;

        this.modalOverlay = document.getElementById('modal_overlay');
        this.modalTitle = document.querySelector('.modal-title');
        this.modalSubtitle = document.querySelector('.subtitle');
        this.confirmBtn = document.getElementById('btn_modal_confirm');
        this.cancelBtn = document.getElementById('btn_modal_cancel');

        this.openModal = this.openModal.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);

        if (this.options.trigger) {
            this.options.trigger.addEventListener('click', this.openModal);
        }
    }

    setupEventListeners() {


        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', this.handleConfirm);
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', this.closeModal);
        }

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
        this.setupEventListeners();
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
        this.destroy();
    }

    // 모달 외부 클릭 처리
    handleOverlayClick(event) {
        if (event.target === this.modalOverlay) {
            this.closeModal();
        }
    }

    // 이벤트 리스너 정리 (필요시 호출)
    destroy() {
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