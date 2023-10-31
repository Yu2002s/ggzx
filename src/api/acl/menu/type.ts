// 数据类型定义
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Permission {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: null
  toCode: null
  type: number
  status: null
  level: number
  children?: PermissionList
  select: boolean
}

export type PermissionList = Permission[]

// 接口返回数据的ts类型
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}

// 添加与修改菜单携带的ts类型
export interface MenuParams {
  id?: number
  code: string // 权限值
  level: number // 新增/更新几级菜单
  name: string // 权限值
  pid: number // 菜单的id
}
