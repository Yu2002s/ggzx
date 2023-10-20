import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import { CategroyResponseData } from '@/api/product/attr/type'
import { defineStore } from 'pinia'
import { CategoryState } from './types/type'
// 商品分类全局组件的仓库

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 储存一级分类数据
      c1Arr: [],
      // 储存一级分类ID
      c1Id: '',
      // 储存对应一级分类下二级分类数据
      c2Arr: [],
      c2Id: '',
      c3Arr: [],
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类
    async getC1() {
      // 发请求获取一级分类数据
      const result: CategroyResponseData = await reqC1()
      if (result.code === 200) {
        this.c1Arr = result.data
      }
    },
    // 获取二级分类
    async getC2() {
      // 发起请求获取二级分类数据
      const result = await reqC2(this.c1Id)
      if (result.code === 200) {
        this.c2Arr = result.data
      }
    },
    // 获取三级分类
    async getC3() {
      // 发起请求获取三级分类数据
      const result = await reqC3(this.c1Id)
      if (result.code === 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
