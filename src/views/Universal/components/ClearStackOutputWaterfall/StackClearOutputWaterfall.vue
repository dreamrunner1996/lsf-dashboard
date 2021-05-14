<template>
  <div class="stack-clear-output-waterfall-content">
    <div class="stack-clear-output-waterfall-title">{{ title }}</div>
    <div class="stack-clear-output-waterfall-canvas-content">
      <div class="stack-clear-output-waterfall-canvas" :id="chartId" />
    </div>
  </div>
</template>

<script>
import './stack-clear-output-waterfall.css'
import {Waterfall} from "@antv/g2plot";

export default {
  props: {
    title: { default: '', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'StackClearOutputWaterfall',
  data: () => ({
    waterfallCanvas: null,
    oldData: []
  }),
  watch: {
    chartData: function (arrVal) {
      if (this.oldData.length !== arrVal.length) {
        if (this.waterfallCanvas) {
          this.waterfallCanvas.destroy()
          this.waterfallCanvas = null
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
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.waterfallCanvas = null
      }
      this.waterfallCanvas = new Waterfall(chartId, {
        data: chartData,
        height: 315,
        autoFit: false,
        animation: false,
        xField: 'time',
        yField: 'value',
        legend: { position: 'top-left' },
        xAxis: {
          label: { style: { fill: '#2c2c2c', fontSize: 13, fontWeight: 'bold' }, autoRotate: true, autoHide: true },
          line: { style: { fill: '#2c2c2c' } }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#2c2c2c', fontSize: 24 } },
          label: { style: { fill: '#2c2c2c', fontSize: 14, fontWeight: 'bold' }, formatter: (val) => { return val } }
        },
        label: {
          style: { fill: '#2c2c2c', fontSize: 18, fontWeight: 'bold' },
          layout: [{ type: 'interval-adjust-position' }]
        },
        total: {
          label: '总数', style: { fill: '#4CAEFF' }
        }
      })
      this.waterfallCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.waterfallCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>