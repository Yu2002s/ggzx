<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefresh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    alt=""
    width="24"
    height="24"
    style="margin: 0 10px"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Setting',
})

const router = useRouter()
const route = useRoute()

// 获取用户相关的仓库
const userStore = useUserStore()

// 获取设置仓库
const layoutSettingStore = useLayoutSettingStore()

// 刷新按钮点击回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}

// 全屏按钮点击的回调
const fullScreen = () => {
  // dom对象的一个属性，可以用来判断当前是不是全屏的模式，如果是全屏会返回boolean真，不是则为false
  let full = document.fullscreenElement
  if (!full) {
    console.log('full')
    // 使用文档的根节点的requestFullscreen，实现全屏模式
    document.documentElement?.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}

// 退出登录点击的回调
const logout = async () => {
  // 向服务器发起请求[退出登录接口]
  // 仓库当中关于用户相关的信息得清空掉
  await userStore.logout()

  // 跳转到登录页面
  router.push({
    path: '/login',
    query: {
      redirect: route.path,
    },
  })
}
</script>

<style scoped></style>
