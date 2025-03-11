export function formatNumber(num) {
  // 1000 미만의 숫자는 그대로 반환
  if (num < 1000) {
    return num.toString();
  }

  // 1000 이상, 10000 미만의 숫자는 k 형식으로 변환
  else if (num < 10000) {
    return Math.floor(num / 1000) + 'k';
  }

  // 10000 이상, 1000000 미만의 숫자는 k 형식으로 변환
  else if (num < 1000000) {
    return Math.floor(num / 1000) + 'k';
  }
}