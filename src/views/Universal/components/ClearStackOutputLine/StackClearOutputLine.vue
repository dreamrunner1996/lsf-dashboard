<template>
  <div class="stack-clear-output-line-content">
    <div class="stack-clear-output-line-title">{{ title }}</div>
    <div class="stack-clear-output-line-canvas-content">
      <div class="stack-clear-output-line-canvas" :id="chartId" />
    </div>
  </div>
</template>

<script>
import './stack-clear-output-line.css'
import { Line } from '@antv/g2plot'

export default {
  props: {
    title: { default: '', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'StackClearOutputLine',
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
        this.CreateCanvas(this.chartId, this.chartData)
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
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.lineCanvas = null
      }
      this.lineCanvas = new Line(chartId, {
        data: chartData,
        height: 315,
        autoFit: false,
        animation: false,
        xField: 'time',
        yField: 'value',
        label: {
          style: { fill: '#2c2c2c', fontSize: 17, fontWeight: 'bold' }
        },
        point: {
          size: 5,
          shape: 'diamond',
          style: { fill: 'white', stroke: '#5B8FF9', lineWidth: 2 }
        },
        yAxis: {
          title: { text: '数量', style: { fill: '#2c2c2c', fontSize: 24 } },
          label: { style: { fill: '#2c2c2c', fontSize: 16, fontWeight: 'bold' }, formatter: (val) => { return val } }
        },
        xAxis: {
          label: { style: { fill: '#2c2c2c', fontSize: 13, fontWeight: 'bold' }, formatter: (val) => { return val }, autoHide: false, autoRotate: true }
        },
        tooltip: { showMarkers: false },
        state: {
          active: {
            style: { shadowBlur: 4, stroke: '#000000', fill: '#000000' }
          }
        },
        interactions: [{ type: 'marker-active' }]
      })
      this.lineCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.lineCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
