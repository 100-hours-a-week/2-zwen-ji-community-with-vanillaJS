const modalOverlay = document.getElementById('modal_overlay');
const modalConfirmBtn = document.getElementById('btn_modal_confirm');
const modalCancelBtn = document.getElementById('btn_modal_cancel');
const modalTitle = document.querySelector('.modal-title');
const modalContent = document.querySelector('.modal-content');

// 모달 컨텍스트 관리 변수
let currentModalContext = {
    type: null,
    postId: null,
    commentId: null,
    callback: null
};

export const modalManager = {
    setup() {
        if (modalConfirmBtn) {
            modalConfirmBtn.removeEventListener('click', this.handleConfirm);
            modalConfirmBtn.addEventListener('click', this.handleConfirm);
        }

        if (modalCancelBtn) {
            modalCancelBtn.removeEventListener('click', this.closeModal);
            modalCancelBtn.addEventListener('click', this.closeModal);
        }

        if (modalOverlay) {
            modalOverlay.removeEventListener('click', this.handleOverlayClick);
            modalOverlay.addEventListener('click', this.handleOverlayClick);
        }
    },

    open(options) {
        if (!modalOverlay || !modalTitle) return;

        currentModalContext = {
            type: options.type,
            postId: options.postId || null,
            commentId: options.commentId || null,
            callback: options.onConfirm || null
        };

        modalTitle.textContent = options.title || '확인';

        if (modalContent && options.content) {
            modalContent.textContent = options.content;
        }
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    /**
     * 확인 버튼 클릭 처리
     */
    handleConfirm() {
        // 타입에 따른 다른 동작 수행
        switch (currentModalContext.type) {
            case 'post-delete':
                console.log("게시글 삭제 API 호출:", currentModalContext.postId);
                // deletePost(currentModalContext.postId);
                break;

            case 'comment-delete':
                console.log("댓글 삭제 API 호출:", currentModalContext.postId, currentModalContext.commentId);
                // deleteComment(currentModalContext.postId, currentModalContext.commentId);
                break;

            default:
                console.log("정의되지 않은 모달 타입:", currentModalContext.type);
        }

        // 콜백 함수가 있으면 실행
        if (typeof currentModalContext.callback === 'function') {
            currentModalContext.callback();
        }

        modalManager.closeModal();
    },

    closeModal() {
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        currentModalContext = {
            type: null,
            postId: null,
            commentId: null,
            callback: null
        };
    },

    handleOverlayClick(event) {
        if (event.target === modalOverlay) {
            modalManager.closeModal();
        }
    },

    openPostDeleteModal(postId) {
        this.open({
            type: 'post-delete',
            title: '게시글을 삭제하시겠습니까?',
            postId: postId,
            onConfirm: async () => {
                try {
                    // 실제 삭제 API 호출 코드
                    // const result = await deletePost(postId);
                    // if (result.status === 'success') {
                    //   window.location.href = '/posts'; // 목록 페이지로 이동
                    // }
                } catch (error) {
                    console.error('게시글 삭제 오류:', error);
                }
            }
        });
    },

    openCommentDeleteModal(postId, commentId) {
        this.open({
            type: 'comment-delete',
            title: '댓글을 삭제하시겠습니까?',
            postId: postId,
            commentId: commentId,
            onConfirm: async () => {
                try {
                    // 실제 삭제 API 호출 코드
                    // const result = await deleteComment(postId, commentId);
                    // if (result.status === 'success') {
                    //   await loadCommentData(postId); // 댓글 목록 다시 로드
                    // }
                } catch (error) {
                    console.error('댓글 삭제 오류:', error);
                }
            }
        });
    },

    openDropModal(userId) {
        this.open({
            type: 'drop-user',
            title: '탈퇴하시겠습니까?',
            userId: userId,
            onConfirm: async () => {
                try {
                    console.log("회원 탈퇴 API 호출")
                    // 실제 삭제 API 호출 코드
                    // const result = await deleteComment(postId, commentId);
                    // if (result.status === 'success') {
                    //   await loadCommentData(postId); // 댓글 목록 다시 로드
                    // }
                } catch (error) {
                    console.error('회원 탈퇴 오류:', error);
                }
            }
        });
    }
};

// 삭제 버튼 이벤트 핸들러 예시
function setupDeleteButtons(postId) {
    // 게시글 삭제 버튼
    const postDeleteBtn = document.getElementById('btn_post_delete');
    if (postDeleteBtn) {
        postDeleteBtn.addEventListener('click', () => {
            modalManager.openPostDeleteModal(postId);
        });
    }
}
// 댓글 삭제 버튼들에 이벤트 추가
export function setupCommentDeleteButtons(postId) {
    const commentDeleteButtons = document.querySelectorAll('.btn-delete-comment');
    commentDeleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            modalManager.openCommentDeleteModal(postId, currentModalContext.commentId);
        });
    });
}


// 초기화 함수
export function initModals(postId) {
    modalManager.setup();
    setupDeleteButtons(postId);
}