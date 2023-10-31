// 路由鉴权, 项目当中的路由不能被访问的权限的设置（某个路由声明情况下可以访问）

import router from './router'
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
import { NavigationGuardNext } from 'vue-router'
import setting from './setting'

// 获取用户相关的仓库内部token数据，去判断用户是否已登录
const userStore = useUserStore(pinia)

// 全局守卫，项目当中任意路由切换都会触发的钩子

// 全局前置守卫
router.beforeEach(async (to: any, _: any, next: NavigationGuardNext) => {
  if (to.meta.title) {
    document.title = setting.title + '-' + to.meta.title
  }
  // to:你将要访问哪个路由
  // from: 你从哪个路由而来
  // next: 路由的放行函数
  // 访问某个路由之前守卫
  nprogress.start()
  // 获取token，去判断用户登录
  const token = userStore.token
  // 获取用户的名字
  const username = userStore.username
  // 用户登录了
  if (token) {
    // 登录成功之后访问login
    if (to.path === '/login') {
      // 前往首页
      next('/')
    } else {
      // 登录成功后访问其余6个路由
      // 有用户信息
      if (username) {
        // 放行
        next()
      } else {
        // 如果没有用户信息，在守卫这里发起请求获取获取到了用户信息在放行
        try {
          // 获取用户信息
          await userStore.userInfo()
          // 刷新的时候是异步路由，有可能获取到了用户信息，异步路由还没有加载完毕，出现了空白的现象
          // 以下方法代表重新加载要访问的路由，路由获取到了用户信息将直接放行，不会再次进入此处
          next({...to, replace: true})
        } catch (error) {
          // token过期，获取不到用户的信息
          // 用户手动修改了本地存储的token
          // 退出登录，把用户相关的数据清空
          await userStore.logout()
          // 跳转到登录页面
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    // 用户未登录
    if (to.path === '/login') {
      next()
    } else {
      // 用户未登录前往登录页
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条 --- nprogress
// 第二个问题：路由鉴权（路由组件访问权限的设置）
// 全部路由组件：登录|404|任意路由|首页|数据大屏|权限管理（3个子路由）|商品管理（4个子路由）

// 用户未登录：可以访问login，其余6个路由不能访问（指向login）
// 用户登录成功后：不可以访问login（指向首页），其余的路由可以访问
