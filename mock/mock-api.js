// 원래의 fetch 함수 저장
const originalFetch = window.fetch;

// 데이터 파일 경로 설정
const DATA_FILES = {
    posts: '../mock/posts.json',
    comments: '../mock/comments.json',
    //users: '/data/users.json'
};

// 모의 데이터베이스 - 메모리 캐시
let memoryCache = {
    posts: null,
    comments: null,
    users: null,
    lastPostId: 0,
    lastCommentId: 0
};
const currentUser = {
    id: "user1",
    email: "user1@example.com",
    nickname: "사용자1",
    profileImage: "/images/profiles/user1.jpg",
    createdAt: "2023-10-15T00:00:00Z"
};

async function loadDataFile(fileType) {
    // 1. 메모리 캐시 확인
    if (memoryCache[fileType] !== null) {
        return memoryCache[fileType];
    }

    // 2. 로컬 스토리지에서 데이터 로드 시도
    try {
        const storedData = localStorage.getItem(`mockAPI_${fileType}`);
        if (storedData) {
            const data = JSON.parse(storedData);
            console.log(`${fileType} 데이터를 로컬 스토리지에서 로드함`);

            // 메모리 캐시에 저장
            memoryCache[fileType] = data;

            // ID 카운터 업데이트
            if (fileType === 'posts' && Array.isArray(data)) {
                memoryCache.lastPostId = Math.max(...data.map(post => parseInt(post.id) || 0), 0);
            } else if (fileType === 'comments' && Array.isArray(data)) {
                memoryCache.lastCommentId = Math.max(...data.map(comment => parseInt(comment.id) || 0), 0);
            }

            return data;
        }
    } catch (localStorageError) {
        console.warn(`${fileType} 로컬 스토리지 로드 실패:`, localStorageError);
    }

    // 3. 로컬 스토리지에 데이터가 없으면 원본 파일에서 로드 시도
    try {
        const response = await originalFetch(DATA_FILES[fileType]);
        if (!response.ok) {
            throw new Error(`${fileType} 데이터를 불러올 수 없습니다.`);
        }

        const data = await response.json();
        // 메모리 캐시에 저장
        memoryCache[fileType] = data;

        // ID 카운터 업데이트
        if (fileType === 'posts') {
            memoryCache.lastPostId = Math.max(...data.map(post => parseInt(post.id) || 0), 0);
        } else if (fileType === 'comments') {
            memoryCache.lastCommentId = Math.max(...data.map(comment => parseInt(comment.id) || 0), 0);
        }

        // 로컬 스토리지에도 저장
        try {
            localStorage.setItem(`mockAPI_${fileType}`, JSON.stringify(data));
            console.log(`${fileType} 데이터를 로컬 스토리지에 저장함`);
        } catch (saveError) {
            console.warn(`${fileType} 로컬 스토리지 저장 실패:`, saveError);
        }

        return data;
    } catch (fetchError) {
        console.error(`${fileType} 파일 로드 실패:`, fetchError);

        // 빈 데이터로 초기화
        const emptyData = [];
        memoryCache[fileType] = emptyData;

        // 빈 데이터도 로컬 스토리지에 저장
        try {
            localStorage.setItem(`mockAPI_${fileType}`, JSON.stringify(emptyData));
        } catch (saveEmptyError) {
            console.warn(`빈 ${fileType} 데이터 로컬 스토리지 저장 실패:`, saveEmptyError);
        }

        return emptyData;
    }
}

function saveData(fileType, data) {
    // 메모리 캐시에 저장
    memoryCache[fileType] = data;

    try {
        localStorage.setItem(`mockAPI_${fileType}`, JSON.stringify(data));
        console.log(`${fileType} 데이터가 저장됨 (메모리 및 localStorage)`, data);
    } catch (error) {
        console.error(`${fileType} 데이터 localStorage 저장 실패:`, error);
        console.log(`${fileType} 데이터는 메모리에만 저장됨`, data);
    }
}

// fetch 함수 재정의
// ==================================================
window.fetch = function (url, options = {}) {
    console.log(`모의 API - 요청 가로챔: ${url}, 메서드: ${options.method || 'GET'}`);

    options = { method: 'GET', headers: {}, ...options };

    // 1. 게시글 목록 조회 API
    if (url.match(/^\/api\/posts(\?.*)?$/) && options.method === 'GET') {
        return new Promise(async resolve => {
            setTimeout(async () => {
                try {
                    // URL에서 페이지 및 제한 파라미터 추출
                    const urlObj = new URL(url, window.location.origin);
                    const page = parseInt(urlObj.searchParams.get('page')) || 1;
                    const limit = parseInt(urlObj.searchParams.get('limit')) || 10;

                    // 데이터 파일 로드
                    let posts = await loadDataFile('posts');

                    // 삭제된 게시글 필터링 (소프트 삭제)
                    posts = posts.filter(post => !post.deleted);

                    // 댓글 수 계산
                    const comments = await loadDataFile('comments');
                    posts = posts.map(post => {
                        const postComments = comments.filter(c => c.postId === post.id && !c.deleted);
                        return { ...post, numComments: postComments.length, comments: undefined };
                    });

                    // 최신 게시글 순으로 정렬
                    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    // 페이지네이션 적용
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                    const paginatedPosts = posts.slice(startIndex, endIndex);

                    // 페이지네이션 메타데이터
                    const totalPosts = posts.length;
                    const totalPages = Math.ceil(totalPosts / limit);
                    const hasNextPage = page < totalPages;

                    const mockResponse = new Response(
                        JSON.stringify({
                            status: "success",
                            data: paginatedPosts,
                            meta: {
                                currentPage: page,
                                totalPages: totalPages,
                                totalItems: totalPosts,
                                itemsPerPage: limit,
                                hasNextPage: hasNextPage
                            }
                        }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(mockResponse);
                } catch (error) {
                    console.error('게시글 목록 조회 API 오류:', error);
                    const errorResponse = new Response(
                        JSON.stringify({ status: "error", message: error.message }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(errorResponse);
                }
            }, 300);
        });
    }

    // 2. 게시글 상세 조회 API
    const postDetailMatch = url.match(/\/api\/posts\/(\d+)$/);
    if (postDetailMatch && options.method === 'GET') {
        const postId = postDetailMatch[1];
        console.log(`게시글 ${postId} 조회 요청 수신됨`);

        return new Promise(async resolve => {
            setTimeout(async () => {
                try {
                    // 게시글 데이터 로드
                    const posts = await loadDataFile('posts');
                    let post = posts.find(p => p.id === postId);

                    if (!post || post.deleted) {
                        const errorResponse = new Response(
                            JSON.stringify({
                                status: "error",
                                message: "게시글을 찾을 수 없습니다."
                            }),
                            { status: 404, headers: { 'Content-Type': 'application/json' } }
                        );
                        return resolve(errorResponse);
                    }

                    // 조회수 증가
                    post.numViewed++;
                    saveData('posts', posts);


                    // 응답 데이터 준비
                    const responseData = {
                        ...post
                    };

                    const mockResponse = new Response(
                        JSON.stringify({ status: "success", data: responseData }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(mockResponse);
                } catch (error) {
                    const errorResponse = new Response(
                        JSON.stringify({ status: "error", message: error.message }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(errorResponse);
                }
            }, 500);
        });
    }

    //3. 게시물 상세조회 시 댓글 로드 API
    const commentsMatch = url.match(/\/api\/posts\/(\d+)\/comments$/);
    if (commentsMatch && options.method === 'GET') {
        const postId = commentsMatch[1];

        return new Promise(async resolve => {
            setTimeout(async () => {

                try {
                    // 댓글 로드
                    const comments = await loadDataFile('comments');
                    const postComments = comments
                        .filter(c => c.postId === postId && !c.deleted)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    const responseData = {
                        numComments: postComments.length,
                        comments: postComments
                    };
                    const mockResponse = new Response(
                        JSON.stringify({ status: "success", data: responseData }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(mockResponse);
                } catch (error) {
                    const errorResponse = new Response(
                        JSON.stringify({ status: "error", message: error.message }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(errorResponse);
                }
            }, 500)
        })
    }

    // 6. 댓글 작성 API
    const commentCreateMatch = url.match(/\/api\/posts\/(\d+)\/comments$/);
    if (commentCreateMatch && options.method === 'POST') {
        const postId = commentCreateMatch[1];
        console.log(`게시글 ${postId}에 댓글 작성 요청 수신됨`);

        return new Promise(async resolve => {
            setTimeout(async () => {
                try {
                    let requestData = {};

                    if (options.body) {
                        try {
                            requestData = JSON.parse(options.body);
                        } catch (e) {
                            console.error('요청 본문 파싱 오류:', e);
                        }
                    }

                    const { body, nickname } = requestData;

                    if (!body) {
                        const errorResponse = new Response(
                            JSON.stringify({
                                status: "error",
                                message: "댓글 내용은 필수 입력 항목입니다."
                            }),
                            { status: 400, headers: { 'Content-Type': 'application/json' } }
                        );
                        return resolve(errorResponse);
                    }

                    // 게시글 확인
                    const posts = await loadDataFile('posts');
                    const post = posts.find(p => p.id === postId);

                    if (!post || post.deleted) {
                        const errorResponse = new Response(
                            JSON.stringify({
                                status: "error",
                                message: "게시글을 찾을 수 없습니다."
                            }),
                            { status: 404, headers: { 'Content-Type': 'application/json' } }
                        );
                        return resolve(errorResponse);
                    }


                    // 댓글 목록 로드
                    const comments = await loadDataFile('comments');
                    // 새 댓글 ID 생성
                    const newId = (++memoryCache.lastCommentId).toString();
                    console.log(newId);
                    const now = new Date();
                    // 새 댓글 생성
                    const newComment =

                    {
                        "id": newId,
                        "postId": postId,
                        "body": body,
                        "nickname": nickname,
                        "createdAt": now.toISOString(),
                        "updatedAt": now.toISOString(),
                        "deleted": false
                    }

                    comments.push(newComment);

                    // 저장
                    saveData('comments', comments);

                    const mockResponse = new Response(
                        JSON.stringify({
                            status: "success",
                            message: "댓글이 성공적으로 작성되었습니다.",
                            data: newComment
                        }),
                        { status: 201, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(mockResponse);
                } catch (error) {
                    console.error("댓글 작성 처리 중 오류 발생:", error);
                    const errorResponse = new Response(
                        JSON.stringify({ status: "error", message: error.message }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(errorResponse);
                }
            }, 400);
        });
    }
    // 현재 사용자 정보 GET API
    const myInformation = url.match(/\/api\/users\/me$/);
    if (myInformation && options.method === 'GET') {
        console.log('현재 사용자 정보 요청 처리');

        return new Promise(resolve => {
            setTimeout(() => {
                const mockResponse = new Response(
                    JSON.stringify({
                        status: "success",
                        data: currentUser
                    }),
                    { status: 200, headers: { 'Content-Type': 'application/json' } }
                );
                resolve(mockResponse);
            }, 300);
        });
    }

    if (myInformation && options.method === 'PUT') {
        console.log('사용자 정보 업데이트 요청 처리');

        return new Promise(resolve => {
            setTimeout(() => {
                try {
                    // 요청 본문 파싱
                    let requestData = {};
                    if (options.body) {
                        requestData = JSON.parse(options.body);
                    }

                    console.log('업데이트 요청 데이터:', requestData);

                    // 현재 사용자 정보 업데이트
                    // 여기서 실제로 업데이트 로직을 구현

                    const mockResponse = new Response(
                        JSON.stringify({
                            status: "success",
                            message: "사용자 정보가 성공적으로 업데이트되었습니다.",
                            data: {
                                // 업데이트된 사용자 정보
                            }
                        }),
                        { status: 200, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(mockResponse);
                } catch (error) {
                    console.error('사용자 정보 업데이트 처리 오류:', error);
                    const errorResponse = new Response(
                        JSON.stringify({
                            status: "error",
                            message: "요청 처리 중 오류가 발생했습니다."
                        }),
                        { status: 500, headers: { 'Content-Type': 'application/json' } }
                    );
                    resolve(errorResponse);
                }
            }, 500);
        });
    }
};


//=====================================================
// // 디버깅을 위한 API 유틸리티
// window.mockAPI = {
//     reset: async function () {
//         await generateInitialData();
//         console.log('데이터가 초기화되었습니다.');
//     },
//     getCache: function () {
//         return { ...memoryCache };
//     },
//     clearCache: function () {
//         memoryCache.posts = null;
//         memoryCache.comments = null;
//         memoryCache.users = null;
//         console.log('메모리 캐시가 초기화되었습니다.');
//     }
// };