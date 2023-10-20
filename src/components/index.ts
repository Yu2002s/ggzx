import { App, Component } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import Category from '@/components/Category/index.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

type ComponentType = {
  [key: string]: Component
}

const allGlobalComponents: ComponentType = { SvgIcon, Category }

export default {
  install(Vue: App) {
    Object.keys(allGlobalComponents).forEach((key: string) => {
      Vue.component(key, allGlobalComponents[key])
    })

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      Vue.component(key, component)
    }
  },
}
