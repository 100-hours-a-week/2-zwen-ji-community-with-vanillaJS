export async function fetchPost(postId) {
    const response = await fetch(`http://localhost:8080/post/${postId}`);
    if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
    }
    return await response.json();
}