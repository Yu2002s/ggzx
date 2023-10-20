// 统一管理项目用户相关的接口
import request from '@/utils/request'
import {
  LoginFormData,
  LoginResponseData,
  ResponseData,
  UserInfoResponseData,
} from './types'

// 项目用户相关的请求地址
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 登录接口
export const login = (data: LoginFormData) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)
// 获取用户信息
export const getUserInfo = () =>
  request.get<any, UserInfoResponseData>(API.USERINFO_URL)
// 退出登录
export const logout = () => request.post<any, ResponseData>(API.LOGOUT_URL)

/* import type { LoginFrom, LoginResponseData, UserResponseData } from "./types"
// 统一管理接口

enum API {
    LOGIN_URL = '/user/login',
    USERINFO_URL = '/user/info',
}

// 对外暴露请求函数
export const login = (data: LoginFrom) => request.post<unknown, LoginResponseData>(API.LOGIN_URL, data)
// 暴露获取用户信息函数
export const getUserInfo = () => request.get<unknown, UserResponseData>(API.USERINFO_URL) */
