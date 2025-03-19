import { createComment, fetchComment } from "../../api/comments_api.js";
import { renderComments } from "./post.js";

export async function loadCommentData(postId) {
    try {
        const result = await fetchComment(postId);
        if (result.status === 'success') {
            renderComments(postId, result.data.comments, postId);
            return result.data;
        } else {
            console.error('API 오류:', result);
            return null;
        }
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        return null;
    }
}

// Entry Point ========================================
export function initCommentModule(postId) {
    // 업로드 버튼 이벤트 등록
    const commentAdd = document.getElementById('btn_comment_upload');
    const commentInput = document.getElementById('comment-input');

    if (!commentAdd) { return; }
    commentAdd.addEventListener('click', async () => {
        console.log("댓글 작성 API 호출");
        try {
            const commentText = commentInput ? commentInput.value.trim() : '';
            if (!commentText) {
                return;
            }

            const commentData = {
                content: commentText,
                postId: postId
            };

            const result = await createComment(commentData);

            if (result.status === 'success') {
                if (commentInput) {
                    commentInput.value = '';
                }
                await loadCommentData(postId);
            } else {
                console.error('API 오류:', result);
            }
        } catch (error) {
            console.error('댓글 작성 오류:', error);
        }
    });
    console.log("댓글 모듈 활성화");
    return;
}

