<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="primary" size="default">主</el-button>
    <el-button type="primary" size="default" :icon="Edit"></el-button>

    <HelloWorld :msg="'hello'"></HelloWorld>
  </div>
</template>

<style scoped lang="scss"></style>
