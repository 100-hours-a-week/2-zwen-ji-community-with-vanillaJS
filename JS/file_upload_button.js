document.addEventListener('DOMContentLoaded', function () {
    const hiddenFileInput = document.getElementById('input_file_upload');
    const fileNameDisplay = document.getElementById('file_name_display');

    hiddenFileInput.addEventListener('change', function (event) {
        if (event.target.files.length > 0) {
            const fileName = event.target.files[0].name;
            fileNameDisplay.textContent = fileName;
        } else {
            fileNameDisplay.textContent = '파일을 선택해주세요.';
        }
    });
});