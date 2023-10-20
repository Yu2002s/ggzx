// 小仓库：layout组件相关的配置文件

import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => ({
    fold: false, // 菜单折叠还是收起的配置)
    refresh: false, // 控制刷新效果
  }),
})

export default useLayoutSettingStore
