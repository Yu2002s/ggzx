<template>
  <!-- 顶部左侧的静态 -->
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'" />
  </el-icon>
  <!--左侧的面包线 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 动态展示路由和标题 -->
    <el-breadcrumb-item
      v-for="item in route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="{ path: item.path }"
    >
      <!-- 面包屑图标 -->
      <el-icon style="vertical-align: middle; margin: 0 4px">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting.ts'
import { useRoute } from 'vue-router'

// 获取路由对象
const route = useRoute()

defineOptions({
  name: 'BreadCurmb',
})

const layoutSettingStore = useLayoutSettingStore()

// 改变图标的方法
const changeIcon = () => {
  // 图标进行切换
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<style scoped></style>
