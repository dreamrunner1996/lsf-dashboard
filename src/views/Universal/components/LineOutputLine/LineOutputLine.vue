<template>
  <div class="line-output-line-content">
    <div class="line-output-line-title-description">
      <div class="line-output-line-title">{{ title }}<span style="color: #141414">.</span></div>
      <div class="line-output-line-description">{{ description }}</div>
    </div>
    <div class="line-output-line-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import './line-output-line.css'

export default {
  props: {
    title: { default: '-', type: String },
    description: { default: '-', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'LineOutputLine',
  data: () => ({
    lineCanvas: null,
    oldData: [],
    maxVal: 50,
    annotationList: []
  }),
  watch: {
    chartData: function (arrVal) {
      if (this.oldData.length !== arrVal.length) {
        if (this.lineCanvas) {
          this.lineCanvas.destroy()
          this.lineCanvas = null
        }
        this.CreateCanvas(this.chartId, arrVal)
        this.oldData = JSON.parse(JSON.stringify(arrVal))
      } else {
        this.UpdateCanvas(arrVal)
      }
    }
  },
  mounted: function () {
    this.CreateCanvas(this.chartId, this.chartData)
  },
  methods: {
    // 创建 canvas
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.lineCanvas = null
      }
      this.annotationList = []
      if (chartData.length) {
        chartData.forEach((chartDataRes, chartDataIndex) => {
          if (chartDataIndex === 0) {
            this.annotationList.push({
              type: 'text',
              position: ['min', chartDataRes.target],
              content: '目标线',
              offsetY: 24,
              offsetX: -28,
              style: { textBaseline: 'bottom', fill: '#F830FF', fontWeight: 'bold', fontSize: 16 }
            })
          }
          if (chartDataIndex > 0) {
            this.annotationList.push({
              type: 'line',
              style: { stroke: '#F830FF', lineDash: [4, 4], lineWidth: 2 },
              start: [chartData[chartDataIndex - 1].time, chartData[chartDataIndex - 1].target],
              end: [chartDataRes.time, chartDataRes.target]
            })
          }
          this.annotationList.push(
            { type: 'text', position: [chartDataRes.time, chartDataRes.target], content: chartDataRes.target, offsetY: -4, offsetX: -16, style: { textBaseline: 'bottom', fill: '#F830FF', fontWeight: 'bold', fontSize: 18 } },
            { type: 'regionFilter', start: ['min', 'max'], end: [chartDataRes.target, '0'], color: '#F4664A' },
            { type: 'regionFilter', start: ['min', 'max'], end: ['max', chartDataRes.target], color: 'springgreen' }
          )
        })
      }
      this.yAxisValueMax(chartData)

      this.lineCanvas = new Line(chartId, {
        data: chartData,
        animation: false,
        xField: 'time',
        yField: 'output',
        label: { style: { fill: '#FFFFFF', fontWeight: 'bold', fontSize: 18 } },
        yAxis: {
          max: this.maxVal,
          title: { text: '数量', style: { fill: '#FFFFFF', fontSize: 24 } },
          label: { style: { fill: '#FFFFFF', fontSize: 16 }, formatter: (val) => { return val } }
        },
        xAxis: {
          label: { style: { fill: '#FFFFFF', fontSize: 12 }, formatter: (val) => { return val }, autoHide: false, autoRotate: true }
        },
        annotations: [
          ...this.annotationList
        ],
        point: {
          size: 5,
          shape: 'circle',
          style: { fill: '#5B8FF9', stroke: '#141414', lineWidth: 1 }
        }
      })
      this.lineCanvas.render()
    },
    // 更新 canvas
    UpdateCanvas: function (chartData) {
      this.lineCanvas.changeData(chartData)
    },
    // 获取 表格最大值
    yAxisValueMax: function (chartData) {
      chartData.forEach(chartDataRes => {
        if (chartDataRes.target > this.maxVal) this.maxVal = chartDataRes.target + 10
        if (chartDataRes.output > this.maxVal) this.maxVal = chartDataRes.output + 10
      })
    }
  }
}
</script>
