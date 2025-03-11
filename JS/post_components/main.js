import { initCommentModule } from './comment.js';
import { initModals } from './modal.js';
import { initPostModule } from './post.js';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id') || '1';

    initPostModule(postId);
    initCommentModule(postId);
    initModals();
    console.log('애플리케이션이 초기화되었습니다.');
});