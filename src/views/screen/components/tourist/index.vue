<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量为
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- echarts展示图文图表 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as Echarts from 'echarts'
// 水球图扩展插件
import 'echarts-liquidfill'
import { onMounted } from 'vue'

const charts = ref()
onMounted(() => {
  // 获取echarts类的实例
  const myCharts = Echarts.init(charts.value)
  // 设置实例的配置项
  myCharts.setOption({
    // 标题组件
    title: {
      text: '水球图',
    },
    // X轴组件
    xAxis: {},
    // Y轴组件
    yAxis: {},
    // 系列决定你展示什么样的图文图表
    series: {
      type: 'liquidFill', // 系列
      radius: '90%',
      data: [0.6, 0.4, 0.2], // 展示的数据
      waveAnimation: true, // 动画
      animationDuration: 3,
      animationDurationUpdate: 0,
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
            color: 'skyblue',
            borderColor: '#294D99',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
    },
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    },
  })
})

const people = ref<string>('216908人')
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      float: right;
      color: white;
      font-size: 20px;

      span {
        color: yellowgreen;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
