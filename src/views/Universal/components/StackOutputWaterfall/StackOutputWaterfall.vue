<template>
  <div class="stack-output-waterfall-content">
    <div class="stack-output-waterfall-title-description">
      <div class="stack-output-waterfall-title">{{ title }}</div>
      <div class="stack-output-waterfall-description">{{ description }}</div>
    </div>
    <div class="stack-output-waterfall-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Waterfall } from '@antv/g2plot'
import './stack-output-waterfall.css'

export default {
  name: 'StackOutputWaterfall',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
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
        this.waterfallCanvas = null
      }
      this.waterfallCanvas = new Waterfall(chartId, {
        data: chartData,
        animation: false,
        xField: 'title',
        yField: 'value',
        legend: { position: 'top-left' },
        xAxis: {
          label: { style: { fill: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#FFFFFF', fontSize: 24 } },
          label: { style: { fill: '#FFFFFF', fontSize: 14 }, formatter: (val) => { return val } }
        },
        label: {
          style: { fill: '#FFFFFF', fontWeight: 'bold' },
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
