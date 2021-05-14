<template>
  <div class="line-output-column-content">
    <div class="line-output-column-title-description">
      <div class="line-output-column-title">{{ title }}<span style="color: #141414">.</span></div>
      <div class="line-output-column-description">{{ description }}</div>
    </div>
    <div class="line-output-column-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Column } from '@antv/g2plot'
import './line-output-column.css'

export default {
  name: 'LineOutputColumn',
  props: {
    title: { default: '-', type: String },
    description: { default: '-', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array },
    color: { default: () => (['#3B90FF', '#F2AE4C', '#3AFF2C', '#ff7575', '#646464']), type: Array }
  },
  data: () => ({
    columnCanvas: null,
    oldData: []
  }),
  watch: {
    chartData: function (arrVal) {
      if (this.oldData.length !== arrVal.length) {
        if (this.columnCanvas) {
          this.columnCanvas.destroy()
          this.columnCanvas = null
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
        this.columnCanvas = null
      }
      this.columnCanvas = new Column(chartId, {
        data: chartData,
        animation: false,
        xField: 'time',
        yField: 'value',
        isGroup: true,
        isStack: true,
        seriesField: 'type',
        groupField: 'name',
        color: this.color,
        label: {
          position: 'middle',
          style: { fontWeight: 'bold', fill: '#FFFFFF' },
          layout: [ { type: 'interval-adjust-position' }, { type: 'interval-hide-overlap' }, { type: 'adjust-color' } ]
        },
        xAxis: {
          label: { style: { fill: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#FFFFFF', fontSize: 24 } },
          label: { style: { fill: '#CECECE', fontSize: 14 }, formatter: (val) => { return val } }
        },
        legend: {
          position: 'top-right',
          itemName: { style: { fill: 'white', fontSize: 16 } }
        }
      })
      this.columnCanvas.render()
    },
    // 更新 canvas
    UpdateCanvas: function (chartData) {
      this.columnCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
