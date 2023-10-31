export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 职位的数据类型
export interface RoleData {
  id?: number
  roleName: string
  createTime?: string
  updateTime?: string
}

// 全部职位的数组的ts类型
export type Records = RoleData[]

// 全部职位数据响应的ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 菜单与按钮数据的ts类型
export interface MenuData {
  id: number
  pid: number
  name: string
  code: string
  createTime: string
  updateTime: string
  toCode: string
  type: number
  status?: any
  level: number
  children?: MenuList
  select: boolean
}

export type MenuList = MenuData[]

// 菜单权限与按钮权限数据的ts的类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
