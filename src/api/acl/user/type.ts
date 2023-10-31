// 账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 代表一个账号信息的ts类型
export interface User {
  id?: number
  username?: string
  name?: string
  phone?: string
  password?: string
  roleName?: string
  createTime?: string
  updateTime?: string
}

// 数组包含所有的用户信息
export type Records = User[]

// 获取所有用户信息接口返回的数据的ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 代表的是一个职位的ts类型
export interface RoleData {
  id?: number
  roleName: string,
  createTime?: string,
  updateTime?: string
}

// 全部职位的列表
export type AllRole = RoleData[]

// 获取全部职位接口返回的ts类型
export interface AllRoleResponseData extends ResponseData { 
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 给用户分配职位的接口携带的类型
export interface SetRoleData {
  roleIdList: number[],
  userId: number
}