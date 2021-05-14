<template>
  <div class="sls-line-all-column-content">
    <div class="sls-line-all-column-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Column } from '@antv/g2plot'
import './sls-line-all-column.css'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array },
    color: { default: () => (['#1596F4', '#00D2E4', '#FA5390']), type: Array }
  },
  name: 'SLSLineAllColumn',
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
      } else this.UpdateCanvas(arrVal)
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
        tooltip: false,
        label: {
          position: 'top',
          style: { fontWeight: 'bold', fill: '#FFFFFF', color: '#FFFFFF', fontSize: 13 }
        },
        xAxis: {
          line: null,
          grid: { line: null },
          label: { style: { fill: '#FFFFFF', fontSize: 14, fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          grid: { line: null },
          label: { style: { fill: '#FFFFFF', fontSize: 20, fontWeight: 'bold' }, formatter: (val) => { return val } }
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
