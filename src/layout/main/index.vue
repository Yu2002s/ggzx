<template>
  <div>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="flag"></component>
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { nextTick } from 'vue'
import { ref } from 'vue'
import { watch } from 'vue'

defineOptions({
  name: 'Main',
})

// 控制当前组件是否销毁重建
const flag = ref(true)

const layoutSettingStore = useLayoutSettingStore()
// 监听仓库内部的数据是否发生变化，如果发生变化，说明用户点击了刷新按钮
watch(
  () => layoutSettingStore.refresh,
  () => {
    // 点击刷新按钮，路由组件销毁
    flag.value = false
    // 响应式数据发生变化后，dom更新完毕时回调
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
