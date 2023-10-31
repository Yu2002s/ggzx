<template>
  <div class='age-container'>
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
<!--   图形图表 -->
    <div class='charts' ref='charts'></div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const charts = ref()

onMounted(() => {
  const myCharts = echarts.init(charts.value)
  myCharts.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: 30,
      top: 40,
      orient: 'vertical', // 图例组件方向
      textStyle: {
        color: 'white',
        fontSize: 14
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white'
        },
        /*emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },*/
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' }
        ]
      }
    ],
    // 调整图形图表的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  })
})
</script>

<style scoped lang='scss'>
.age-container {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: 260px;
  }
}
</style>