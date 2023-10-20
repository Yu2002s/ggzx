// 封装一个函数：获取一个结果：当前早上|上午|下午|晚上
export const getTime = (): string => {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 6) {
    return '早上'
  } else if (hour < 12) {
    return '上午'
  } else if (hour < 18) {
    return '下午'
  } else {
    return '晚上'
  }
}
