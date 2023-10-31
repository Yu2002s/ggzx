<script setup lang='ts'>
import * as Echarts from 'echarts'
import { onMounted, ref } from 'vue'

const charts = ref<HTMLDivElement | undefined>()

onMounted(()=>{
  // 一个容器可以展示多种图像图表
  const myCharts = Echarts.init(charts.value)
  myCharts.setOption({
    // 标题组件
    title: {
      text: '景区排行', // 主标题
      // 标题位置
      left: '40%',
      link: 'http://www.baidu.com',
      // 主标题文字样式
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      },
      subtext: '各大景区排行',
      // 子标题样式
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16
      }
    },
    // X轴和Y轴
    xAxis: {
      // 均匀分布
      type: 'category'
    },
    yAxis: {

    },
    // 布局
    grid: {
      top: 100,
      bottom: 40
      /*left: 20,
      bottom: 20,
      right: 20*/
    },
    // 系列,决定图形图表是哪一种
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 50],
        // 柱状图的，图形上文本标签，
        label: {
          show: true,
          // 文字的位置
          position: 'insideTop',
          color: 'white'
        },
        // 是否显示背景颜色
        showBackground: true,
        backgroundStyle: {
          color: '#ccc'
        },
        // 柱条的样式
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          // 柱条颜色
          color: function(data: any) {
            // 每一个柱条设置背景颜色
            const arr = ['red', 'orange', 'hotpink', 'yellowgreen']
            return arr[data.dataIndex]
          }
        }
      },
      {
        type: 'line',
        data: [10, 20, 30, 50],
        // 平滑曲线
        smooth: true
      }
    ],
    // 提示
    tooltip: {

    }
  })
})

</script>

<template>
<div class='rank-container'>
  <div class="title">
    <p>热门景区排行</p>
    <img src="../../images/dataScreen-title.png" alt="" />
  </div>
<!--  图形 -->

  <div class='charts' ref='charts'></div>
</div>
</template>

<style scoped lang='scss'>
.rank-container {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    margin-left: 5px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>