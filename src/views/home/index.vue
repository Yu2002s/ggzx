<template>
  <div>
    <el-card>
      <el-row align="middle">
        <img :src="userStore.avatar" alt="" class="avatar" />
        <div style="margin-left: 20px">
          <h3 class="title">{{ getTime() }}好呀， {{ userStore.username }}</h3>
          <p>硅谷甄选运营平台</p>
        </div>
      </el-row>
    </el-card>
    <el-row justify="center">
      <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

// 引入用户相关的仓库，获取当前用户头像信息
const userStore = useUserStore()
// 获取存储用户信息的仓库对象
</script>

<style scoped lang="scss">
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.title {
  font-size: 30px;
  margin-bottom: 20px;
}
</style>
