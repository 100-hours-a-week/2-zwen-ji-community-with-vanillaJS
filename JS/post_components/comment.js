const commentsList = document.getElementById('comments-list');

export function renderComments(comments) {
    if (!commentsList) return;

    commentsList.innerHTML = '';

    if (comments.length === 0) {
        const noCommentsMessage = document.createElement('p');
        noCommentsMessage.className = 'no-comments-message';
        noCommentsMessage.textContent = '아직 댓글이 없습니다. 첫 댓글을 작성해보세요!';
        commentsList.appendChild(noCommentsMessage);
        return;
    }

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.id = `comment-${comment.commentIndex}`;

        commentElement.innerHTML = `
        <div class="writer-info">
            <div class="svg-container">
                <svg>
                    <ellipse></ellipse>
                </svg>
            </div>
            <div class="user-nickname">${comment.nickname}</div>
        </div>
        <div class="datetime">${new Date(comment.createdAt).toDateString()}</div>
        <div class="comment-content"> ${comment.body}</div>
        ${true ? `
        <div class="button-group">
            <button class="button-type4">수정</button>
            <button id='btn_comment_delete' class="button-type4">삭제</button>
        </div>` : ''}
      `;

        commentsList.appendChild(commentElement);
    });

    // isCurrentUser(comment.nickname)

}