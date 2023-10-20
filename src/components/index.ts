import { App, Component } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

type ComponentType = {
    [key: string]: Component
}

const allGlobalComponents: ComponentType = { SvgIcon }

export default {
  install(app: App) {
    Object.keys(allGlobalComponents).forEach((key: string) => {
      app.component(key, allGlobalComponents[key])
    })
  },
}
