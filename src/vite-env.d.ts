/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, object>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn.mjs'
