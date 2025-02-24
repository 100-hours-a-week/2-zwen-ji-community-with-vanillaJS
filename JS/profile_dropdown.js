document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.getElementById('profileImage');
    const profileDropdown = document.querySelector('.profile-dropdown');

    // 프로필 이미지 클릭 시 드롭다운 토글
    profileImage.addEventListener('click', function (e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    // 다른 곳 클릭 시 드롭다운 닫기
    document.addEventListener('click', function () {
        profileDropdown.classList.remove('active');
    });
});