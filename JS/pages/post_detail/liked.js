import { formatNumber } from "../../utils/number_format.js";

export function initLikedMoudule(isLikedByCurrentUser, likesCount) {
    const likeCountElement = document.getElementById('liked-info');
    const likedBox = document.getElementById('liked-box');

    const likedState = {
        isLiked: isLikedByCurrentUser,
        likeCount: likesCount || 0,

        updateCurrentState() {
            try {
                if (this.isLiked) {
                    // 좋아요 취소 로직
                    likedBox.classList.remove('active');
                    this.likeCount -= 1;
                    this.isLiked = false;
                    this.callUnlikeAPI();
                } else {
                    // 좋아요 추가 로직
                    likedBox.classList.add('active');
                    this.likeCount += 1;
                    this.isLiked = true;
                    this.callLikeAPI();
                }

                // 좋아요 카운트 업데이트
                likeCountElement.textContent = formatNumber(this.likeCount);
            } catch (error) {
                console.error('좋아요 상태 업데이트 중 오류 발생:', error);
            }
        },
        callLikeAPI() {
            // TODO
            console.log("좋아요 추가 API 호출");

        },

        callUnlikeAPI() {
            // TODO
            console.log("좋아요 취소 API 호출");
        }
    }

    if (isLikedByCurrentUser) {
        likedBox.classList.add('active');
    }

    if (likedBox) {
        likedBox.addEventListener('click', () => {
            likedState.updateCurrentState();
        })
    }
    console.log("좋아요 모듈 활성화");

    return likedState;
}