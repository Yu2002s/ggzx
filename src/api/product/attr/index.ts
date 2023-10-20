// 这里是书写属性相关的ts文件
import request from '@/utils/request'
import { CategroyResponseData } from './type'

// 属性管理模块接口地址
enum API {
  // 获取一级分类的接口地址
  C1_URL = '/admin/product/getCategory1',
  // 获取二级分类地址
  C2_URL = '/admin/product/getCategory2/',
  // 获取三级分类地址
  C3_URL = '/admin/product/getCategory3/',
}

// 获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategroyResponseData>(API.C1_URL)
// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategroyResponseData>(API.C2_URL + category1Id)
// 获取三级分类接口方法
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategroyResponseData>(API.C3_URL + category2Id)
