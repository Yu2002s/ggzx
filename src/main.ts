import { createApp } from 'vue'
import App from './App.vue'
// 引入element-plus插件
import ElementPlus from 'element-plus'
// 引入样式文件
import 'element-plus/dist/index.css'
// 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化配置
})
app.mount('#app')
