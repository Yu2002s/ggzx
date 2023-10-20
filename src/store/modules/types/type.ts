// 定义小仓库类型数据 state类型
import { Category } from '@/api/product/attr/type'
import type { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

// 定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
  c1Arr: Category[]
  c2Arr: Category[]
  c3Arr: Category[]
}
