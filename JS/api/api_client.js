// 게시글 조회 API




// 댓글 작성 API
export async function createComment(postId, commentText) {
    const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentText })
    });
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// 댓글 삭제 API
export async function deleteComment(postId, commentId) {
    const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}

// 게시글 삭제 API
export async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}