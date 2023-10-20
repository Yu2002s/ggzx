<script setup lang="ts">
// 获取父组件传递过来的全部路由数组
import type { RouteRecordRaw } from 'vue-router'

defineProps<{
  menuList: Array<RouteRecordRaw>
}>()
</script>

<template>
  <div>
    <h1>{{ menuList }}</h1>
    <template v-for="(item, index) in menuList" :key="item.path">
      <!--   没有子路由   -->
      <template v-if="!item.children">
        <el-menu-item :index="item.path" v-if="!item.meta.hidden">
          <template #title>
            <span>标&nbsp;</span>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!--   有子路由且只有一个子路由   -->
      <template v-else-if="item.children && item.children.length === 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
        >
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!--   有子路由，且个数大于1个   -->
      <el-sub-menu v-else :index="item.path">
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"/>
      </el-sub-menu>
    </template>
    <!--  <el-menu-item index="1">首页</el-menu-item>
      <el-menu-item index="2">数据大屏</el-menu-item>
      &lt;!&ndash;    折叠的菜单      &ndash;&gt;
      <el-sub-menu index="3">
        <template #title>
          <span>权限管理</span>
        </template>
        <el-menu-item index="3-1">用户管理</el-menu-item>
        <el-menu-item index="3-3">角色管理</el-menu-item>
        <el-menu-item index="3-2">菜单管理</el-menu-item>
      </el-sub-menu>-->
  </div>
</template>

<style scoped lang="scss"></style>