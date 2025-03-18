import { manageLoginStatus } from '../../utils/login.js';
import { initCommentModule } from './comment.js';
import { initLikedMoudule } from './liked.js';
import { initPostModule } from './post.js';


document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id') || '1';

    console.log("post ID 획득함");
    manageLoginStatus();
    initPostModule(postId);
    initCommentModule(postId);
    initLikedMoudule();
});