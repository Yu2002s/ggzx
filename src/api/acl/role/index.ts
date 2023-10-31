// 角色管理模块接口
import request from '@/utils/request'
import type { MenuResponseData, RoleData, RoleResponseData } from './type'

// 枚举地址
enum API {
  // 获取全部的职位接口
  ALL_ROLE_URL = '/admin/acl/role/',
  // 新增职位的接口地址
  ADD_ROLE_URL = '/admin/acl/role/save',
  // 更新已有职位的接口地址
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 获取全部的菜单与按钮的数据
  ALL_PERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给相应的角色分配权限
  SET_PERMISSION_URL = '/admin/acl/permission/doAssign',
  // 删除已有的职位
  REMOVE_ROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALL_ROLE_URL + `${page}/${limit}?roleName=${roleName}`)

// 新增职位或更新已有职位的接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_ROLE_URL, data)
  }
}

// 获取全部菜单与按钮权限的数据
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALL_PERMISSION_URL + roleId)

// 给相应的职位分配权限
export const reqSetPermission = (roleId: number, permissionIds: number[]) =>
  request.post<any, any>(API.SET_PERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionIds}`)

export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVE_ROLE_URL + roleId)
