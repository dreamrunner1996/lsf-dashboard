<template>
  <div class="stack-clear-output-liquid-content">
    <div class="stack-clear-output-liquid-canvas" :id="chartId" />
  </div>
</template>

<script>
import './stack-clear-output-liquid.css'
import { Liquid } from '@antv/g2plot'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Number }
  },
  name: 'StackClearOutputLiquid',
  data: () => ({
    liquidCanvas: null
  }),
  watch: {
    chartData: function (newVal) {
      this.UpdateCanvas(newVal)
    }
  },
  mounted: function () {
    this.CreateCanvas(this.chartId, this.chartData)
  },
  methods: {
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.liquidCanvas = null
      }
      this.liquidCanvas = new Liquid(chartId, {
        height: 250,
        animation: false,
        autoFit: false,
        statistic: {
          title: { formatter: () => '与上一时段对比', style: { fontSize: 24, fill: '#1b1b1b' } },
          content: { style: { fontSize: 30, lineHeight: 1, fill: '#1b1b1b' } }
        },
        liquidStyle: {
          fill: 'dodgerblue',
          stroke: 'dodgerblue'
        },
        percent: chartData,
        outline: {
          border: 4,
          distance: 8
        },
        wave: {
          length: 128
        }
      })
      this.liquidCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.liquidCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>