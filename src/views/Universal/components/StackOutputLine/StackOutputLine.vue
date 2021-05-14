<template>
  <div class="stack-output-line-content">
    <div class="stack-output-line-title-description">
      <div class="stack-output-line-title">{{ title }}</div>
      <div class="stack-output-line-description">{{ description }}</div>
    </div>
    <div class="stack-output-line-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import './stack-output-line.css'

export default {
  props: {
    title: { default: '-', type: String },
    description: { default: '-', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array },
    color: { default: 'rgb(65, 235, 251)', type: String }
  },
  name: 'StackOutputLine',
  data: () => ({
    lineCanvas: null,
    oldData: []
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
      this.lineCanvas = new Line(chartId, {
        data: chartData,
        animation: false,
        xField: 'title',
        yField: 'value',
        color: this.color,
        label: {
          style: { fill: '#FFFFFF', fontSize: 15 }
        },
        point: {
          size: 5,
          shape: 'diamond',
          style: { fill: '#FFFFFF', stroke: '#5B8FF9', lineWidth: 2 }
        },
        tooltip: { showMarkers: false },
        xAxis: {
          label: { style: { fill: '#FFFFFF', fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#FFFFFF', fontSize: 24 } },
          label: { style: { fill: '#FFFFFF', fontSize: 17, fontWeight: 'bold' }, formatter: (val) => { return val } }
        }
      })

      this.lineCanvas.render()
    },
    // 更新 canvas
    UpdateCanvas: function (chartData) {
      this.lineCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
