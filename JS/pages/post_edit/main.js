import { createPost, updatePost, uploadPostImage } from "../../api/post_api.js";
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
    const { mode, postId } = getEditorMode();
    if (mode == 'create') {
        const navigateButton = document.querySelector(".navigate-before");
        navigateButton.addEventListener("click", function () {
            window.location.href = `list.html`;
        });
    } else {
        const navigateButton = document.querySelector(".navigate-before");
        navigateButton.addEventListener("click", function () {
            window.location.href = `post.html?id=${postId}`;
        });
    }

    const imageButton = document.getElementById("btn_file_upload")
    const postImage = document.getElementById('input_file_upload');
    imageButton.addEventListener('click', () => {
        postImage.click();
    })

    let selectedImage = null;

    // 이미지 선택 이벤트 처리
    postImage.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedImage = file;
            console.log('이미지가 선택되었습니다:', file.name);
            document.getElementById("file_name_display").textContent = file.name;
        }
    });


    submitButton.addEventListener('click', async function () {
        try {
            if (!formState.isFormValid()) {
                return;
            }

            submitButton.disabled = true;
            const { mode, postId } = getEditorMode();
            let imageUrl = "default_image";

            if (postImage.files && postImage.files.length > 0) {
                try {
                    console.log("게시물 이미지 업로드 시작");
                    imageUrl = await uploadPostImage(postImage.files[0]);
                    console.log("게시물 이미지 업로드 완료:", imageUrl);
                } catch (error) {
                    console.error("이미지 업로드 오류:", error);
                    alert("이미지 업로드에 실패했습니다: " + error.message);
                    submitButton.disabled = false;
                    return;
                }
            }

            // 게시물 데이터 준비
            const formData = {
                title: post_title.value.trim(),
                content: post_body.value.trim(),
                imageUrl: imageUrl
            };
            if (mode === 'create') {
                try {
                    console.log("게시물 생성 API 호출");
                    const response = await createPost(formData);
                    if (response.status == "success") {
                        window.location.href = `post.html?id=${response.data}`;
                    } else {
                        throw new Error(response.message || "게시물 생성에 실패했습니다.");
                    }
                } catch (error) {
                    console.error("게시물 생성 오류:", error.message);
                    alert("게시물 생성 중 오류가 발생했습니다: " + error.message);
                }
            } else {
                try {
                    console.log("게시물 수정 API 호출");
                    const response = await updatePost(postId, formData);
                    if (response.status == "success") {
                        window.location.href = `post.html?id=${response.data}`;
                    } else {
                        throw new Error(response.message || "게시물 수정에 실패했습니다.");
                    }
                } catch (error) {
                    console.error("게시물 수정 오류:", error.message);
                    alert("게시물 수정 중 오류가 발생했습니다: " + error.message);
                }
            }
        } catch (error) {
            console.error("오류 발생:", error);
        } finally {
            submitButton.disabled = false;
        }
    });

});

