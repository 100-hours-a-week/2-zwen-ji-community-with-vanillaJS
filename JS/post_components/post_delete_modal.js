document.addEventListener('DOMContentLoaded', function () {
    const modalOverlay = document.getElementById('modal_overlay');
    const modalPostDelete = document.getElementById('btn_post_delete');
    const modalCommentDelete = document.getElementById('btn_comment_delete');
    const modalConfirmBtn = document.getElementById('btn_modal_confirm');
    const modalCancelBtn = document.getElementById('btn_modal_cancel');
    const modalTitle = document.querySelector('.modal-title');

    const modalType = {
        isPost: true,
        confirmModal() {
            console.log('확인 클릭');
            if (this.isPost) {
                //TODO
                console.log("게시글 삭제 API 호출")
            }
            else {
                //TODO
                console.log("댓글 삭제 API 호출")
            }
            cancelModal();
        },


        openModal() {
            if (modalOverlay) {
                let text;
                if (this.isPost) {
                    text = "게시글";
                } else {
                    text = "댓글";
                }
                modalTitle.textContent = `${text}을 삭제하시겠습니까 ?`;
                modalOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        }


    }

    function cancelModal() {
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    if (modalPostDelete) {
        modalPostDelete.addEventListener('click', () => {
            modalType.isPost = true;
            modalType.openModal();

        });
    }

    if (modalCommentDelete) {
        modalCommentDelete.addEventListener('click', () => {
            console.log("ss");
            modalType.isPost = false;
            modalType.openModal();
        });
    }

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            modalType.confirmModal();
        });
    }

    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', cancelModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (event) {
            if (event.target === modalOverlay) {
                cancelModal();
            }
        });
    }
});