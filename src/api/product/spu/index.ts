// SPU管理模块接口

import request from '@/utils/request.ts'
import type {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SkuData,
  SkuInfoData,
  SpuData,
  SpuHasImg,
} from '@/api/product/spu/type.ts'

enum API {
  // 获取已有SPU的数据
  HAS_SPU_URL = '/admin/product/',
  // 获取全部品牌的数据
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某一个spu下的全部的售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  // 获取某一个spu下的全部已有的销售属性接口
  SPU_HAS_ATTRIBUTE_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目所有的销售属性[颜色，版本，尺码]
  ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
  // 追加一个新的spu
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的spu
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新的sku地址
  ADD_SKU_URK = '/admin/product/saveSkuInfo',
  // 查看某一个已有spu的sku
  SKU_INFO_URL = '/admin/product/findBySpuId/',
  // 删除已有spu
  REMOVE_SPU_URL = '/admin/product/deleteSpu/',
}

// 获取某一个三级分类下已有的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HAS_SPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取所有spu品牌的数据
export const reqAllTrademark = () =>
  request.get<any, AllTradeMark>(API.ALL_TRADEMARK_URL)

// 获取某一个已有的spu下的全部的商品图片数据
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

// 获取某一个已有的spu下的全部的销售属性接口
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPU_HAS_ATTRIBUTE_URL + spuId)

// 获取全部的销售属性
export const reqSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALL_SALE_ATTR_URL)

// 添加新的spu接口
// 更新已有的spu接口
// data:新增的spu对象，或者已有的spu对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果spu对象拥有id。更新已有的spu
  if (data.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, data)
  } else {
    return request.post<any, any>(API.ADD_SPU_URL, data)
  }
}

// 添加sku的请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADD_SKU_URK, data)

// 获取sku的数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKU_INFO_URL + spuId)

// 删除已有的spu
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVE_SPU_URL + spuId)
