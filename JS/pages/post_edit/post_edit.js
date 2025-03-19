import { fetchPost } from "../../api/post_api.js";

let editorMode = 'create';
let currentPostId = null;

function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


export async function initEditPage() {
    // 폼 요소 참조
    const postTitle = document.getElementById('post-title');
    const postBody = document.getElementById('post-body');

    if (!postTitle || !postBody) {
        console.error('필요한 폼 요소를 찾을 수 없습니다.');
        return;
    }
    const postId = getPostIdFromUrl();

    if (postId) {
        try {
            setEditorMode('edit', postId);

            const result = await fetchPost(postId);

            if (result.status === 'success' && result.data || true) {
                postTitle.value = result.data.title || '';
                postBody.value = result.data.content || '';
                console.log('게시물 데이터 로드 완료:', result.data);
            } else {
                throw new Error(result.message || '게시물을 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('게시글 로드 오류:', error);
            alert('게시물을 불러올 수 없습니다.');
            window.location.href = `./post.html?id=${postId}`;
        }
    } else {
        setEditorMode('create');

        postTitle.value = '';
        postBody.value = '';
        console.log('새 게시물 작성 모드로 초기화되었습니다.');
    }
}


export function setEditorMode(mode, postId = null) {
    editorMode = mode;
    currentPostId = postId;

    // // UI 요소 참조
    // const submitButton = document.getElementById('submit-button');

    // // UI 업데이트
    // if (mode === 'create') {
    //     document.title = '새 게시물 작성';
    //     if (submitButton) submitButton.textContent = '게시물 등록';
    // } else {
    //     document.title = '게시물 수정';
    //     if (submitButton) submitButton.textContent = '게시물 수정';
    // }
}

export function getEditorMode() {
    return {
        mode: editorMode,
        postId: currentPostId
    };
}