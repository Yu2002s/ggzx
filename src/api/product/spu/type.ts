// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  msg: string
  ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  category3Id: string | number
  tmId: string | number
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}

// 数组包含元素都是已有spu数据类型
export type Records = SpuData[]

// 定义获取已有的spu接口返回的数据类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImage {
  id?: number
  spuId?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  name?: string
  url?: string
}

// 已有的spu的照片墙的数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImage[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
  createTime?: string,
  updateTime?: string
}

// 储存已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型
export interface SaleAttr {
  id?: number
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  createTime?: string
  updateTime?: string
  flag?: boolean
  saleAttrValue?: string
  saleIdAndValueId?: string
}

// spu已有的销售属性接口返回的ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部spu返回的数据类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface SkuAttrValue {
  attrId: number | string
  valueId: number | string
}

export interface SkuSaleAttrValue {
  saleAttrId: number | string
  saleAttrValueId: number | string
}

export interface SkuData {
  category3Id: string | number,
  spuId: string | number,
  tmId: string | number,
  skuName: string,
  price: string | number,
  weight: string | number,
  skuDesc: string,
  skuAttrValueList?: SkuAttrValue[],
  skuSaleAttrValueList?: SkuSaleAttrValue[]
  skuDefaultImg: string
}

// 获取sku数据接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}