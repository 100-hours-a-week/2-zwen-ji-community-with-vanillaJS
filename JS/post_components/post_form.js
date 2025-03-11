export function initEditForm() {
    const helpertext1 = document.getElementById('helper-text');
    const post_title = document.getElementById('post-title');
    const post_body = document.getElementById('post-body');
    const submitButton = document.getElementById('submit-button');


    const formState = {
        titleValidation: false,
        bodyValidation: false,

        updateHelperText() {
            if (this.isFormValid()) {
                helpertext1.textContent = "";
            }
            else {
                helpertext1.textContent = "*제목, 내용을 모두 작성해주세요."
            }
        },

        isFormValid() {
            return this.titleValidation && this.bodyValidation;
        },

        updateSubmitButton() {
            if (submitButton) {
                if (this.isFormValid()) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-disabled');
                    submitButton.classList.add('btn-active');
                } else {
                    submitButton.disabled = true;
                    submitButton.classList.remove('btn-active');
                    submitButton.classList.add('btn-disabled');
                }
            }
        }
    }
    if (post_title.value.length > 0) {
        formState.titleValidation = true;
    }
    else {
        formState.titleValidation = false;
    }

    if (post_body.value.length > 0) {
        formState.bodyValidation = true;
    }
    else {
        formState.bodyValidation = false;
    }
    formState.updateHelperText();


    post_title.addEventListener("input", () => {
        const titleValue = post_title.value;
        if (titleValue.length > 0) {
            formState.titleValidation = true;
        }
        else {
            formState.titleValidation = false;
        }
        formState.updateSubmitButton();
        formState.updateHelperText();
    })

    post_body.addEventListener("input", () => {
        const bodyValue = post_body.value;
        if (bodyValue.length > 0) {
            formState.bodyValidation = true;
        }
        else {
            formState.bodyValidation = false;
        }
        formState.updateSubmitButton();
        formState.updateHelperText();
    })

    submitButton.addEventListener("click", () => {
        // API 호출
    })
}

document.addEventListener('DOMContentLoaded', () => {
    initEditForm();
});