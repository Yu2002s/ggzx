<template>
  <div>
    <svg :style="{ width, height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  prefix?: string
  color?: string
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  prefix: '#icon-',
  color: '',
  width: '16px',
  height: '16px',
})
</script>

<style scoped></style>
