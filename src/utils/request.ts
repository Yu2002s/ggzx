// 进行axios二次封装，使用请求与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 引入用户相关的仓库
import useUserStore from '@/store/modules/user'

// 使用axios对象的create方法创建一个axios实例
const request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径 /api
  timeout: 5000, // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use((config) => {
  // config 对象里面有个headers属性请求头，进程给服务器端携带公共的参数
  // 获取用户相关的仓库：获取仓库内部的token，登录成功后携带给服务器
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  // 返回配置对象
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    // 响应成功
    return res.data
  },
  (err) => {
    // 响应失败
    let message = ''
    // http状态码
    const status = err.response.status
    switch (status) {
      case 401:
        message = '未授权，请登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址出错'
        break
      case 408:
        message = '请求超时'
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = '网络出现问题'
        break
    }

    ElMessage.error(message)
    return Promise.reject(err)
  },
)

export default request
