# 2-zwen-ji-community-with-vanillaJS

[Github Pages Link](https://100-hours-a-week.github.io/2-zwen-ji-community-with-vanillaJS/)

## 프로젝트 설명



## 프로젝트 구조

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
    ├── api : `fetch 메서드 호출`
    │   ├── users_api.js
    │   ├── post_api.js
    │   ├── comments_api.js
    │   └── likes_api.js
    ├── pages
    │   ├── login
    │   │   └── main.js : `각 페이지의 초기화`
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
        ├── date-utils.js
        ├── formState.js
        ├── login.js
        ├── modal.js
        ├── number_format.js
        ├── profileImageSelector.js
        ├── toast.js
        ├── user.js
        └── validator.js


##