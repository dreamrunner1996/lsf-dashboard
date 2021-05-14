<template>
  <div class="line-clear-output-line-content">
    <div class="line-clear-output-line-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import './line-clear-output-line.css'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'LineClearOutputLine',
  data: () => ({
    maxVal: 10,
    lineCanvas: null,
    oldData: [],
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
              style: { textBaseline: 'bottom', fill: '#F4664A', fontWeight: 'bold', fontSize: 16 }
            })
          }
          if (chartDataIndex > 0) {
            this.annotationList.push({
              type: 'line',
              style: { stroke: '#F4664A', lineDash: [4, 4], lineWidth: 2 },
              start: [chartData[chartDataIndex - 1].time, chartData[chartDataIndex - 1].target],
              end: [chartDataRes.time, chartDataRes.target]
            })
          }
          this.annotationList.push(
              { type: 'text', position: [chartDataRes.time, chartDataRes.target], content: chartDataRes.target, offsetY: -4, offsetX: -16, style: { textBaseline: 'bottom', fill: '#F4664A', fontWeight: 'bold', fontSize: 18 } },
              { type: 'regionFilter', start: ['min', chartDataRes.target], end: [chartDataRes.target, 'min'], color: 'rgb(245, 110, 83)' },
              { type: 'regionFilter', start: ['min', 'max'], end: ['max', chartDataRes.target], color: 'rgb(102, 231, 97)' }
          )
        })
      }
      this.yAxisValueMax(chartData)

      this.lineCanvas = new Line(chartId, {
        height: 250,
        autoFit: false,
        data: chartData,
        animation: false,
        xField: 'time',
        yField: 'output',
        color: '#5B8FF9',
        label: { style: { fill: '#5B8FF9', fontWeight: 'bold', fontSize: 18 } },
        yAxis: {
          max: this.maxVal + 5,
          title: { text: '数量', style: { fill: '#2c2c2c', fontSize: 24 } },
          label: { style: { fill: '#2c2c2c', fontSize: 16, fontWeight: 'bold' }, formatter: (val) => { return val } }
        },
        xAxis: {
          label: { style: { fill: '#2c2c2c', fontSize: 11, fontWeight: 'bold' }, formatter: (val) => { return val }, autoHide: false, autoRotate: true }
        },
        annotations: [
          ...this.annotationList
        ],
        point: {
          size: 5,
          shape: 'circle',
          style: { fill: '#5B8FF9', stroke: '#5B8FF9', lineWidth: 1 }
        }
      })
      this.lineCanvas.render()
    },
    // 更新 Canvas
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
