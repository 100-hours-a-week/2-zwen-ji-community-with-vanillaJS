import { createFormState } from "../../utils/formState.js";
import { manageLoginStatus } from "../../utils/login.js";
import { isValidPostContent, isValidPostTitle } from "../../utils/validator.js";
import { getEditorMode, initEditPage } from "./post_edit.js";


const helpertext1 = document.getElementById('helper-text');
const post_title = document.getElementById('post-title');
const post_body = document.getElementById('post-body');
const submitButton = document.getElementById('submit-button');


document.addEventListener('DOMContentLoaded', function () {
    manageLoginStatus();


    initEditPage();

    const fields = ['title', 'content'];
    const formState = createFormState(fields, { helpertext1 }, submitButton);

    // Overriding
    formState.updateFormState = function (fieldName, validationResult) {
        this[`${fieldName}Valid`] = validationResult.isValid;
        this.updateHelperText('helpertext1', validationResult.message);
        this.updateSubmitButton();
    };
    formState.updateSubmitButton();

    post_title.addEventListener("input", () => {
        formState.updateFormState('title', isValidPostTitle(post_title.value));
        if (formState.titleValid) {
            formState.updateFormState('content', isValidPostContent(post_body.value));
        }
    });

    post_body.addEventListener("input", () => {
        formState.updateFormState('content', isValidPostContent(post_body.value));
        if (formState.contentValid) {
            formState.updateFormState('title', isValidPostTitle(post_title.value));
        }
    });

    submitButton.addEventListener('click', async function () {
        const { mode, postId } = getEditorMode();

        if (mode === 'create') {
            console.log("게시물 생성 API 호출");
            await createPost(formData);
        } else {
            console.log("게시물 수정 API 호출");
            await updatePost(postId, formData);
        }
    });
});

