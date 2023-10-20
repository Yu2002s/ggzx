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
export interface CategroyResponseData extends ResponseData {
  data: Category[]
}
