# 2-zwen-ji-community-with-vanillaJS

[Github Pages Link](https://100-hours-a-week.github.io/2-zwen-ji-community-with-vanillaJS/)

## 프로젝트 설명 
게시글, 댓글, 좋아요 기능을 포함하는  간단한 온라인 커뮤니티 제작.

PL : HTML + CSS + JavaScript 
Tools : Postman, VSCode, Chrome 

## 프로젝트 구조 (FE)

```
Project
├── HTML
│   ├── login.html
│   ├── signup.html
│   ├── list.html
│   ├── post.html
│   ├── post_edit.html
│   ├── edit_profile.html
│   └── edit_password.html
├── CSS
│   ├── global.css
│   ├── login.css
│   ├── signup.css
│   ├── list.css
│   ├── post.css
│   ├── make_post.css
│   ├── edit_profile.css
│   └── edit_password.css
└── JS
    ├── api : `📤 fetch 메서드 호출`
    │   ├── users_api.js
    │   ├── post_api.js
    │   ├── comments_api.js
    │   └── likes_api.js
    ├── pages
    │   ├── login
    │   │   └── main.js : `🛠️ 페이지 초기화`
    │   ├── signup
    │   │   └── main.js
    │   ├── list
    │   │   ├── main.js
    │   │   ├── list.js
    │   │   └── infinite_scroll.js
    │   ├── post_detail
    │   │   ├── main.js
    │   │   ├── post.js
    │   │   ├── comment.js
    │   │   └── liked.js
    │   ├── post_edit
    │   │   ├── main.js
    │   │   └── post_edit.js
    │   ├── profile_edit
    │   │   └── profile_edit.js
    │   └── password_edit
    │       └── edit_password.js
    └── utils
        ├── date-utils.js : `📅 날짜 형식 지정`
        ├── formState.js : `🎛️ 폼의 상태를 관리`
        ├── login.js : `🔑 현재 사용자의 로그인 정보 관리`
        ├── modal.js : `모달 관리 클래스`
        ├── number_format.js `숫자 형식 지정`
        ├── profileImageSelector.js `🔗 프로필 사진 입력 폼`
        ├── toast.js : `🍞 토스트 메세지`
        ├── user.js : `현재 사용자의 정보 가져오기`
        └── validator.js : `✔️ 유효성 검사 함수 모음`
```
