<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 引入顶部的子组件
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Couter from './components/couter/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
const screen = ref<HTMLDivElement | null>(null)

onMounted(() => {
  screen.value!!.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

// 监听视口变化
window.onresize = () => {
  screen.value!!.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

// 定义大屏缩放比例
const getScale = () => {
  const ww = window.innerWidth / screen.value!!.clientWidth
  const wh = window.innerHeight / screen.value!!.clientHeight
  return ww < wh ? ww : wh
}
</script>

<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top/>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class='map'/>
          <Line class='line'/>
        </div>
        <div class="right">
          <Rank class='rank'/>
          <Year class='year'/>
          <Couter class='count'/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    width: 1920px;
    height: 1080px;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .right {
        margin-left: 20px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .count {
          flex: 1;
        }
      }

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 1040px;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 4;
        }

        .line {
          flex: 1;

        }
      }
    }
  }
}
</style>
