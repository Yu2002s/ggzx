<script setup lang="ts">
import * as Echarts from 'echarts'
import { onMounted, ref } from 'vue'
import chinaJson from './chaina.json'

const map = ref<HTMLDivElement | undefined>()
// 注册中国地图
Echarts.registerMap('china', chinaJson as any)

onMounted(() => {
  const myChart = Echarts.init(map.value as HTMLDivElement)
  myChart.setOption({
    // 地图组件
    title: {
      text: 'ECharts 入门示例',
    },
    // 地图组件
    geo: {
      map: 'china', // 中国地图
      // roam: true, // 鼠标缩放效果
      // 地图位置
      /*left: 50,
      top: 100,
      right: 150,
      bottom: 150*/
      // 地图上文字的设置
      label: {
        show: true,
        // 文字旋转
        // rotate: 20
        // 文字颜色
        color: 'white',
        fontSize: 14,
      },
      // 每一个多边形的样式
      itemStyle: {
        // color: 'red',
        // areaColor: 'cyan',
        color: {
          // 线性渐变
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      // 地图高亮效果
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 40,
          color: 'white',
        },
      },
    },
    grid: {},
    series: [
      {
        type: 'lines', // 航线
        data: [
          {
            coords: [
              [109.754859, 19.189767], // 初始点经纬度
              [116.41995, 40.18994], //目标点经纬度
            ],
            label: {
              start: '海口',
              end: '北京',
            },
            lineStyle: {
              color: 'orange',
              width: 4
            },
          },
          {
            coords: [
              [120, 30.189767], // 初始点经纬度
              [89.41995, 40.18994], //目标点经纬度
            ],
            label: {
              start: '海口',
              end: '北京',
            },
            lineStyle: {
              color: 'orange',
              width: 4
            },
          }
        ],
        // 是否显示特效
        effect: {
          show: true,
          symbol: 'image://data:image/png;base64,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',
          // color: 'red',
          symbolSize: 15
        }
      },
    ],
  })
})
</script>

<template>
  <div class="map-container" ref="map">我是地图组件</div>
</template>

<style scoped lang="scss"></style>