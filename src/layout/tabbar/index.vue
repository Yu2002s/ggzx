<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <Breadcurmb></Breadcurmb>
    </div>
    <div class="tabbar-right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcurmb from './breadcurmb/index.vue'
import Setting from './setting/index.vue'

defineOptions({
  name: 'Tabbar',
})
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  /* background-image: linear-gradient(
    to right,
    rgb(247, 210, 210),
    rgb(219, 193, 193),
    rgb(246, 215, 215)
  ); */

  .tabbar-left {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }

  .tabbar-right {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>
