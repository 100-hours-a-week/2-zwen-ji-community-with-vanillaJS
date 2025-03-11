import { fetchPost } from "./post.js";
import { initEditForm } from "./post_form.js";

function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 페이지 초기화 함수
async function initEditPage() {
    const postId = getPostIdFromUrl();

    if (!postId) {
        alert('게시글 ID가 지정되지 않았습니다.');
        window.location.href = './post_edit';
        return;
    }

    try {
        // 게시글 데이터 불러오기
        const result = await fetchPost(postId);

        if (result.status === 'success') {
            document.getElementById('post-title').value = result.data.title;
            document.getElementById('post-body').value = result.data.body;
        } else {
            window.location.href = './list.html';
        }
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        window.location.href = './list.html';
    }
    initEditForm();
}

document.addEventListener('DOMContentLoaded', () => {
    initEditPage();
}
);