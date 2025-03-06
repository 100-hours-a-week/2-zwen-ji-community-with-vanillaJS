document.addEventListener('DOMContentLoaded', () => {
    const likedInfo = document.getElementById('liked-info');
    const likedBox = document.getElementById('liked-box');

    const liked = {
        isLiked: false,
        num: 0,
        getCurrentNum() {

        },
        updateCurrentState() {
            if (this.isLiked) {
                likedBox.classList.remove('active');
                liked.num -= 1;
                this.isLiked = false;
            } else {
                likedBox.classList.add('active');
                liked.num += 1;
                this.isLiked = true;
            }
            likedInfo.textContent = this.num;
        }
    }

    liked.getCurrentNum();
    liked.updateCurrentState();

    if (likedBox) {
        likedBox.addEventListener('click', () => {
            liked.updateCurrentState();
        })
    }
})
