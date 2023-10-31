<script setup lang='ts'>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

// 获取图形图表的dom节点
const charts = ref<HTMLDivElement | null>(  null)

onMounted(() => {
  const myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white'
      },

    },
    xAxis: {
      type: 'category',
      show: false
    },
    yAxis: {
      show: false
    },
    grid: {
      top: 50,
      left: 20,
      bottom: 20,
      right: 20
    },
    series: {
      type: 'scatter',
      data: [33, 14, 99, 245, 124, 48, 11, 188],
      // 标记图形的设置
      // symbol: 'arrow'
      symbolSize: 16,
      label: {
        show: true,
        position: 'top',
        color: 'yellowgreen'
      }
    }
  })
})
</script>

<template>
<div class='year-container'>
  <div class="title">
    <p>年度游客量对比</p>
    <img src="../../images/dataScreen-title.png" alt="" />
  </div>
  <div class='charts' ref='charts'></div>
</div>
</template>

<style scoped lang='scss'>
.year-container {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    /*margin-left: 20px;*/

    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>