import { App } from 'vue'
import useUserStore from '@/store/modules/user.ts'
import pinia from '@/store'
const userStore = useUserStore(pinia)

export const isHasButton = (app: App) => {
  // 全局自定义指令，实现按钮的权限
  app.directive('has', {
    mounted(el: any, options: any) {
      // 使用这个全局自定义指令Dom|组件挂载完毕
      // 自定义指令右侧的数据没有在用户信息buttons数组中，删除el节点
      if (!userStore.buttons.includes(options.value)) {
        // el.parentNode.removeChild(el)
        el.remove()
      }
    }
  })
}