// 원래의 fetch 함수 저장
const originalFetch = window.fetch;

// 가짜 게시글 데이터 생성 함수
function generateMockPostData(id) {
    const comments = Array.from({ length: 5 }, (_, index) => ({
        commentIndex: index + 1,
        body: `게시글 ${id}에 대한 ${index + 1}번째 댓글입니다.`,
        nickname: `댓글작성자${index + 1}`,
        createdAt: new Date(Date.now() - index * 86400000).toISOString()
    }));

    return {
        status: "success",
        data: {
            title: `!!게시글 ${id}의 제목`,
            body: `!!이것은 게시글 ${id}의 본문입니다.`,
            nickname: "!!작성자!!",
            image: null,
            numLiked: Math.floor(Math.random() * 200),
            numViewed: Math.floor(Math.random() * 500) + 100,
            numComments: comments.length,
            createdAt: new Date().toISOString(),
            comments: comments
        }
    };
}

// fetch 함수 재정의
window.fetch = function (url, options = {}) {
    console.log(`모의 API - 요청 가로챔: ${url}`);

    // 게시글 조회 API
    if (url.match(/\/api\/posts\/\d+$/)) {
        const id = url.split('/').pop();
        console.log(`게시글 ${id} 조회 요청 수신됨`);

        return new Promise(resolve => {
            setTimeout(() => {
                const mockData = generateMockPostData(id);
                const mockResponse = new Response(
                    JSON.stringify(mockData),
                    {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
                resolve(mockResponse);
            }, 500); // 500ms 지연
        });
    }

    // // 댓글 작성 API
    // if (url.match(/\/api\/posts\/\d+\/comments$/) && (options.method === 'POST' || options.method === undefined)) {
    //     const postId = url.split('/')[3]; // URL에서 게시글 ID 추출
    //     console.log(`게시글 ${postId}에 댓글 작성 요청 수신됨`);

    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             // 요청 본문 처리
    //             let commentBody = "기본 댓글 내용";

    //             if (options.body) {
    //                 try {
    //                     const bodyObject = JSON.parse(options.body);
    //                     commentBody = bodyObject.body || commentBody;
    //                 } catch (e) {
    //                     console.error('요청 본문 파싱 오류:', e);
    //                 }
    //             }

    //             // 모의 응답 생성
    //             const mockResponse = new Response(
    //                 JSON.stringify({
    //                     status: "success",
    //                     message: "댓글이 성공적으로 작성되었습니다.",
    //                     data: {
    //                         commentIndex: Math.floor(Math.random() * 100) + 1,
    //                         body: commentBody,
    //                         nickname: "현재사용자",
    //                         createdAt: new Date().toISOString(),
    //                         postId
    //                     }
    //                 }),
    //                 {
    //                     status: 201,
    //                     headers: { 'Content-Type': 'application/json' }
    //                 }
    //             );

    //             resolve(mockResponse);
    //         }, 400); // 400ms 지연
    //     });
    // }

    // // 게시글 삭제 API
    // if (url.match(/\/api\/posts\/\d+$/) && options.method === 'DELETE') {
    //     const id = url.split('/').pop();
    //     console.log(`게시글 ${id} 삭제 요청 수신됨`);

    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             const mockResponse = new Response(
    //                 JSON.stringify({
    //                     status: "success",
    //                     message: "게시글이 성공적으로 삭제되었습니다.",
    //                     data: {
    //                         deletedId: id
    //                     }
    //                 }),
    //                 {
    //                     status: 200,
    //                     headers: { 'Content-Type': 'application/json' }
    //                 }
    //             );

    //             resolve(mockResponse);
    //         }, 600); // 600ms 지연
    //     });
    // }

    // // 댓글 삭제 API
    // if (url.match(/\/api\/posts\/\d+\/comments\/\d+$/) && options.method === 'DELETE') {
    //     const urlParts = url.split('/');
    //     const postId = urlParts[3];
    //     const commentId = urlParts[5];

    //     console.log(`게시글 ${postId}의 댓글 ${commentId} 삭제 요청 수신됨`);

    //     return new Promise(resolve => {
    //         setTimeout(() => {
    //             const mockResponse = new Response(
    //                 JSON.stringify({
    //                     status: "success",
    //                     message: "댓글이 성공적으로 삭제되었습니다.",
    //                     data: {
    //                         deletedCommentId: commentId,
    //                         postId
    //                     }
    //                 }),
    //                 {
    //                     status: 200,
    //                     headers: { 'Content-Type': 'application/json' }
    //                 }
    //             );

    //             resolve(mockResponse);
    //         }, 400); // 400ms 지연
    //     });
    // }

    // 가로채지 않은 요청은 원래 fetch로 전달
    return originalFetch(url, options);
};

console.log('모의 API 시스템이 활성화되었습니다. API 요청이 가로채어집니다.');