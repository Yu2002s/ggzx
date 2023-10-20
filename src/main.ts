import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件
import ElementPlus from 'element-plus'
// 引入样式文件
import 'element-plus/dist/index.css'
// 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
import globalComponents from '@/components/index.ts'

import '@/styles/index.scss'
import router from './router'
import pinia from './store'

const app = createApp(App)
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
