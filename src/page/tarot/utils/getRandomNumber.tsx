export function getTwoUniqueNumbers() {
  const arr = Array.from({ length: 22 }, (_, i) => i); // 生成0-21数组
  const result = [];

  for (let i = 0; i < 2; i++) {
    const randIndex = Math.floor(Math.random() * (22 - i));
    [arr[randIndex], arr[21 - i]] = [arr[21 - i], arr[randIndex]]; // 交换元素
    result.push(arr[21 - i]);
  }

  return result;
}
