<script setup lang='ts'>
import * as ECharts from 'echarts'
import { onMounted, ref } from 'vue'

const charts = ref<HTMLDivElement | undefined>()

onMounted(() =>{
  const myCharts = ECharts.init(charts.value)
  myCharts.setOption({
    // 标题组件
    title: {
      text: '游客访问量趋势图'
    },
    // X和Y轴
    xAxis: {
      type: 'category',
      // 两侧不留白
      boundaryGap: false,
      // 分割线
      splitLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 刻度
      axisTick: {
        show: true
      }
    },
    yAxis: {
      splitLine: {
        show: false
      },
      // 轴线
      axisLine: {
        show: true
      },
      // 刻度
      axisTick: {
        show: true
      }
    },
    grid: {
      top: 0,
      left: 40,
      bottom: 20,
      right: 20
    },
    // 系列
    series: [
      {
        type: 'line',
        data: [120, 240, 66, 399, 100, 400, 321],
        // 平滑曲线
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'red' // 0% 处的颜色
            }, {
              offset: 1, color: 'blue' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  })
})

</script>

<template>
<div class='line-container'>
  <div class="title">
    <p>未来七天游客数量趋势</p>
    <img src="../../images/dataScreen-title.png" alt="" />
  </div>
  <div class='charts' ref='charts'></div>
</div>
</template>

<style scoped lang='scss'>
.line-container {
  width: 98%;
  height: 100%;
  background: url("../../images/dataScreen-main-cb.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>