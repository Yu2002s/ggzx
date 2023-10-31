<template>
  <div class='box'>
    <div>
      <img src='@/assets/images/error_images/404.png' height='400' alt=''>
    </div>
    <button @click='goHome'>返回首页</button>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang='scss'>
.box {
  width: 100vw;
  height: 100vh;
}
</style>
