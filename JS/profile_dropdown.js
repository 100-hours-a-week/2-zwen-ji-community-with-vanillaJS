document.addEventListener('DOMContentLoaded', function () {
    const profileImage = document.getElementById('profileImage');
    const profileDropdown = document.querySelector('.profile-dropdown');

    profileImage.addEventListener('click', function (e) {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    document.addEventListener('click', function () {
        profileDropdown.classList.remove('active');
    });
});