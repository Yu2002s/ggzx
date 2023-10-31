// 用户管理模块的接口

import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type'

enum API {
  // 获取全部已有用户的账号信息
  ALL_USER_URL = '/admin/acl/user/',
  // 添加一个新的用户账号
  ADD_USER_URL = '/admin/acl/user/save',
  // 更新已有用户账号信息
  UPDATE_USER_URL = '/admin/acl/user/update',
  // 获取全部职位，以及当前账号拥有的职位接口
  ALL_ROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有的用户分配相应的角色接口
  SET_ROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除某一个账号
  DELETE_USER_URL = '/admin/acl/user/remove/',
  // 批量删除
  DELETE_ALL_USER_URL = '/admin/acl/user/batchRemove',
}

// 获取用户账号信息的方法
export const reqUserInfo = (page: number, limit: number, username: string = '') =>
  request.get<any, UserResponseData>(API.ALL_USER_URL + `${page}/${limit}?username=${username}`)

// 添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_USER_URL, data)
  } else {
    return request.post<any, any>(API.ADD_USER_URL, data)
  }
}

// 获取全部的职位，以及包含当前用户已有的职位
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALL_ROLE_URL + userId)

// 分配职位
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SET_ROLE_URL, data)

// 删除某一个账号的信息
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETE_USER_URL + userId)

// 批量删除的接口
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETE_ALL_USER_URL, { data: idList })
