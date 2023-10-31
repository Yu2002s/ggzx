<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
    style="margin-right: 10px"
  ></el-button>
  <el-color-picker
    @change="setColor"
    size="small"
    v-model="color"
    show-alpha
    :predefine="predefineColors"
  />
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <template #default>
      <el-form>
        <el-form-item label="主题颜色"></el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            v-model="dark"
            inline-prompt
            size="small"
            active-icon="MoonNight"
            inactive-icon="Sunny"
            @change="changeDark"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #reference>
      <el-button size="small" icon="Setting" circle style="margin-left: 10px"></el-button>
    </template>
  </el-popover>
  <img :src="userStore.avatar" alt="" width="24" height="24" style="margin: 0 10px" />
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'Setting',
})

const router = useRouter()
const route = useRoute()
// 收集开关的数据
const dark = ref<boolean>(false)

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

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

// switch开关的change事件进行暗黑模式切换
const changeDark = () => {
  // 获取html根节点
  const html = document.documentElement
  // 判断html标签是否有类名
  dark.value ? (html.className = 'dark') : (html.className = '')
}

// 主题颜色设置
const setColor = () => {
  // 通过js修改根节点的样式对象属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<style scoped></style>
