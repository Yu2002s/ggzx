import request from '@/utils/request'
import type { MenuParams, PermissionResponseData } from './type'

// 枚举地址
enum API {
  // 获取全部菜单与按钮的标识数据
  ALL_PERMISSION_URL = '/admin/acl/permission',
  // 给某一级新增一个子菜单
  ADD_MENU_URL = '/admin/acl/permission/save',
  // 更新某一个已有的菜单
  UPDATE_MENU_URL = '/admin/acl/permission/update',
  // 删除已有的菜单
  DELETE_MENU_URL = '/admin/acl/permission/remove/',
}

// 获取菜单的数据
export const reqAllPermission = () =>
  request.get<any, PermissionResponseData>(API.ALL_PERMISSION_URL)

// 添加与更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_MENU_URL, data)
  } else {
    return request.post<any, any>(API.ADD_MENU_URL, data)
  }
}

// 删除某一个已有的菜单
export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.DELETE_MENU_URL + id)
