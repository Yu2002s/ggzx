// 统一管理项目用户相关的接口
import request from "@/utils/request"
import type { LoginFrom, LoginResponseData, UserResponseData } from "./types"
// 统一管理接口

enum API {
    LOGIN_URL = '/user/login',
    USERINFO_URL = '/user/info',
}

// 对外暴露请求函数
export const login = (data: LoginFrom) => request.post<LoginResponseData>(API.LOGIN_URL, data)
// 暴露获取用户信息函数
export const getUserInfo = () => request.get<UserResponseData>(API.USERINFO_URL)