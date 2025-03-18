export async function loadCommentData(postId) {
    try {
        const result = await fetchComment(postId);
        console.log(result.data);
        if (result.status === 'success') {
            renderComments(result.data.comments, postId);
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
        // try {
        //     const commentText = commentInput ? commentInput.value.trim() : '';
        //     if (!commentText) {
        //         return;
        //     }

        //     const commentData = {
        //         body: commentText
        //     };

        //     const result = await postComment(postId, commentData);

        //     if (result.status === 'success') {
        //         if (commentInput) {
        //             commentInput.value = '';
        //         }
        //         await loadCommentData(postId);
        //     } else {
        //         console.error('API 오류:', result);
        //     }
        // } catch (error) {
        //     console.error('댓글 작성 오류:', error);
        // }
    });
    console.log("댓글 모듈 활성화");
    return;
}



// Seperate Later 
// GET comment ================================
export async function fetchComment(postId) {
    const response = await fetch(`/api/post/${postId}/comment`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}
// POST comment ================================
export async function postComment(postId, commentData) {
    const response = await fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
    });

    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// DELETE comment ===============================
export async function deleteComment(postId, commentId) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        throw error;
    }
}