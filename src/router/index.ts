// 通过vue-router插件实现路由配置

import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoute,
  scrollBehavior: () => {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
