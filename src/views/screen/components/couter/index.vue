<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

// 获取图形图表的dom节点
const charts = ref<HTMLDivElement | null>(null)

let nameList = ['教学态度', '教学内容', '教学方式', '教学基本功', '教学效果'] // 名字
let valueList = [85, 80, 60, 76, 85] // 分数,最大值为100

let indicatorList = <{name: string, value: number, max: number}[]>[]
nameList.map((item, index) => {
  indicatorList.push({
    name: item,
    value: valueList[index],
    max: 100,
  })
})

onMounted(() => {
  const myCharts = echarts.init(charts.value)
  myCharts.setOption({
    radar: {
      // shape: 'circle',
      indicator: indicatorList,
      axisName: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
        formatter: function (value: any, _: any) {
          return `{a|${value}}`
        },
        rich: {
          a: {
            fontSize: '14px',
            fontFamily: ' Source Han Sans CN-Regular',
            fontWeight: 400,
            color: 'white',
            padding: [0, 8, 0, 0],
          },
          b: {
            padding: [4, 8, 4, 8],
            backgroundColor: 'rgba(229, 243, 255, 0.6500)',
            borderRadius: 50,
            fontFamily: 'Source Han Sans CN-Medium',
            fontWeight: 500,
            color: '#397EF0',
          },
        },
      },
    },
    series: [
      {
        name: '雷达图',
        type: 'radar',
        color: 'rgba(57, 126, 240, 1)',
        label: {
          show: false,
        },
        areaStyle: {
          color: 'rgba(170, 217, 255, 0.35)',
        },
        data: [
          {
            value: valueList,
            name: 'Allocated Budget',
          },
        ],
      },
    ],
  })
})
</script>

<template>
  <div class="count-container">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class='charts' ref='charts'></div>
  </div>
</template>

<style scoped lang="scss">
.count-container {
  width: 100%;
  height: 100%;
  background: url('../../images/dataScreen-main-cb.png') no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: 230px;
  }
}
</style>