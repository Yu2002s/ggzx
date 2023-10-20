// 登录接口需要携带参数的ts类型

export interface LoginFrom {
    username: string
    password: string
}

interface DataType {
    token: string
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
}