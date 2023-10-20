<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from '@/layout/menu/MenuList.vue'
import useUserStore from '@/store/modules/user.ts'
import Main from './main/index.vue'
// 获取路由对象
import { useRoute } from 'vue-router'
// 顶部tabbar组件
import Tabbar from './tabbar/index.vue'
import useLayoutSettingStore from '@/store/modules/setting'

const layoutSettingStore = useLayoutSettingStore()

const route = useRoute()
console.log(route.path)

// 获取用户相关的小仓库
const userStore = useUserStore()
// console.log(userStore.menuRoutes)

defineOptions({
  name: 'Layout',
})
</script>

<template>
  <div class="layout-container">
    <!-- 左侧的菜单 -->
    <div class="layout-slider" :class="{ fold: layoutSettingStore.fold }">
      <Logo />
      <!--  展示菜单  -->
      <!--   滚动组件   -->
      <el-scrollbar class="scrollbar">
        <!--    菜单组件    -->
        <el-menu
          mode="vertical"
          background-color="#001259"
          text-color="white"
          :default-active="route.path"
          :collapse="layoutSettingStore.fold"
        >
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout-tabbar" :class="{ fold: layoutSettingStore.fold }">
      <!--  layout组件的顶部导航  -->
      <Tabbar />
    </div>
    <div class="layout-main" :class="{ fold: layoutSettingStore.fold }">
      <Main></Main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  .layout-slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base-menu-min-width;
    }
  }

  .layout-tabbar {
    position: fixed;
    z-index: 999;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    top: 0;
    left: $base-menu-width;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout-main {
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
