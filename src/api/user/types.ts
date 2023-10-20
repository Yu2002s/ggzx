// 定义用户相关的数据ts类型
// 用户登录接口携带参数的ts类型
export interface LoginFormData {
  username: string
  password: string
}

// 定义全部接口返回数据都拥有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 登录接口返回的数据类型
export interface LoginResponseData extends ResponseData {
  data: string
}

// 定义获取用户信息返回的数据类型
export interface UserInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    rules: string[]
    name: string
    avatar: string
  }
}

/* // 登录接口需要携带参数的ts类型

export interface LoginFrom {
    username: string
    password: string
}

interface DataType {
    token?: string,
    message?: string
}

// 登录接口返回的数据类型

export interface LoginResponseData {
    code: number,
    data: DataType
}

// 定义服务器返回用户信息相关的数据类型

interface UserInfo {
    userId: number,
    avatar: string,
    username: string,
    password: string,
    desc: string,
    rules: string[],
    buttons: string[],
    routes: string[],
    token: string
}

interface User {
    checkUser: UserInfo
}

export interface UserResponseData {
    code: number,
    data: User
} */
