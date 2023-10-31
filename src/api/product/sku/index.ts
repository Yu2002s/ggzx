import request from "@/utils/request"
import type { SkuInfoData, SkuResponseData } from './type'

// sku模块接口
enum API {
  // 获取已有的商品数据
  SKU_URL = '/admin/product/list/',
  // 商品上架接口
  SALE_URL = '/admin/product/onSale/',
  // 下架的接口
  CANCEL_SALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口
  SKU_INFO_URL = '/admin/product/getSkuInfo/',
  // 删除已有的商品
  DELETE_SKU_URL = '/admin/product/deleteSku/',
}

// 获取商品sku的接口
export const reqSkuList = (page: number, limit: number) => 
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 已有商品上架的请求
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)

// 下架的请求
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCEL_SALE_URL + skuId)

// 获取商品详情信息的请求
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKU_INFO_URL + skuId)

// 删除某一个已有的商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETE_SKU_URL + skuId)