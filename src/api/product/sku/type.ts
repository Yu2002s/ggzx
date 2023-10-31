
export interface ResponseData {
  code: number,
  message: string,
  ok: boolean
}

//  定义sku对象的数据类型
export interface SkuAttrValue {
  id?: number
  attrId: number | string
  valueId: number | string
  valueName: string
}

export interface SkuSaleAttrValue {
  id?: string
  saleAttrId: number | string
  saleAttrValueId: number | string
  saleAttrValueName: string
}

export interface SkuData {
  category3Id?: string | number
  spuId?: string | number
  tmId?: string | number
  skuName?: string
  price?: string | number
  weight?: string | number
  skuDesc?: string
  skuAttrValueList?: SkuAttrValue[]
  skuSaleAttrValueList?: SkuSaleAttrValue[]
  skuDefaultImg?: string,
  isSale?: number,
  id?: number
  skuImageList?: any
}

// 获取sku接口返回数据的类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[],
    total: number,
    size: number,
    current: number,
    hitCount: boolean,
    countId: number,
    maxLimit: null,
    pages: number
  }
}

// 获取sku商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
  data: SkuData
}