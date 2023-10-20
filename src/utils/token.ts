// 封装本地出存储数据与读取数据方法

// 存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('token', token)
}

// 获取数据
export const GET_TOKEN = () => localStorage.getItem('token')

// 本地储存删除数据方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('token')
}
