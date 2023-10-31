// 分类相关的数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 分类ts类型
export interface Category {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 响应的数据接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
  data: Category[]
}

// 属性与属性值类型

// 属性值对象
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number,
  flag?: boolean
}

// 储存每一个属性值的数据类型
export type AttrValueList = AttrValue[]
// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
  attrIdAndValueId?: string
}
// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]

// 属性对象返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}