import {
  LoginFormData,
  LoginResponseData,
  ResponseData,
  UserInfoResponseData,
} from './../../api/user/types'
// import type { LoginFrom, LoginResponseData } from '@/api/user/types'
// 创建用户相关的小仓库

import { login, getUserInfo, logout } from '@/api/user'
import { defineStore } from 'pinia'
import type { UserState } from './types/type'
// 引入操作本地存储的方法
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
// 引入路由（常量）
import { constantRoute } from '@/router/routes.ts'

const useUserStore = defineStore('User', {
  // 小仓库，存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识
      menuRoutes: constantRoute, // 仓库存储菜单需要的数组（路由）
      username: '',
      avatar: '',
    }
  },
  // 处理异步|逻辑的地方
  actions: {
    async userLogin(data: LoginFormData) {
      const result: LoginResponseData = await login(data)
      // 登录请求成功：200 -> token
      // 登录请求失败：201 -> 登录失败的错误信息
      if (result.code === 200) {
        this.token = result.data as string
        // 由于pinia储存对象其实是利用js对象
        // 本地持久化存储
        SET_TOKEN(this.token)
        return 'ok'
      }
      return Promise.reject(new Error(result.data))
    },
    // 获取用户信息
    async userInfo() {
      // 获取用户信息进行储存仓库当中[用户头像，用户名]
      const result: UserInfoResponseData = await getUserInfo()
      // 如果获取用户信息成功，就储存用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async logout() {
      // 退出登录请求
      const result: ResponseData = await logout()
      if (result.code === 200) {
        // 目前没有mock接口：退出登录接口（通知服务器当前token已失效）
        this.token = ''
        this.username = ''
        this.avatar = ''
        // 清除token
        REMOVE_TOKEN()
        return 'ok'
      }
      return Promise.reject(new Error(result.message))
    },
  },
  getters: {},
})

// 对外暴漏获取小仓库的方法
export default useUserStore
