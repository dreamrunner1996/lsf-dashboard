<template>
  <div class="line-clear-output-waterfall-content">
    <div class="line-clear-output-waterfall-canvas" :id="chartId" />
  </div>
</template>

<script>
import './line-clear-output-waterfall.css'
import { Waterfall } from '@antv/g2plot'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  data: () => ({
    oldData: [],
    waterfallCanvas: null
  }),
  name: "LineClearOutputWaterfall",
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
        height: 250,
        autoFit: false,
        data: chartData,
        animation: false,
        xField: 'time',
        yField: 'value',
        legend: { position: 'top-left' },
        xAxis: {
          label: { style: { fill: '#2c2c2c', fontSize: 11, fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#2c2c2c', fontSize: 24 } },
          label: { style: { fill: '#2c2c2c', fontSize: 14 }, formatter: (val) => { return val } }
        },
        label: {
          style: { fill: 'black', fontWeight: 'bold' },
          layout: [{ type: 'interval-adjust-position' }]
        },
        total: {
          label: '总数', style: { fill: '#FF802A' }
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