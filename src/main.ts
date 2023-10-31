import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件
import ElementPlus from 'element-plus'
// 引入样式文件
import 'element-plus/dist/index.css'
// 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
import globalComponents from '@/components'

import '@/styles/index.scss'
import router from './router'
import pinia from './store'
// 引入自定义指令文件
import {isHasButton} from '@/directive/has.ts'

const app = createApp(App)
isHasButton(app)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化配置
})
// 安装全局组件插件
app.use(globalComponents)
app.use(router)
app.use(pinia)
// 引入鉴权
import './permission'

app.mount('#app')
