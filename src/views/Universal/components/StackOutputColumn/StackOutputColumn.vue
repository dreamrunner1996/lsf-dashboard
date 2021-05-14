<template>
  <div class="stack-output-column-content">
    <div class="stack-output-column-title-description">
      <div class="stack-output-column-title">{{ title }}</div>
      <div class="stack-output-column-description">{{ description }}</div>
    </div>
    <div class="stack-output-column-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Column } from '@antv/g2plot'
import './stack-output-column.css'

export default {
  name: 'StackOutputColumn',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
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
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.columnCanvas = null
      }
      this.columnCanvas = new Column(chartId, {
        data: chartData,
        animation: false,
        xField: 'title',
        yField: 'value',
        label: {
          position: 'middle',
          style: { fill: '#FFFFFF', opacity: 1 }
        },
        xAxis: {
          label: { style: { fill: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }, autoRotate: true, autoHide: false }
        },
        yAxis: {
          min: 0,
          title: { text: '数量', style: { fill: '#FFFFFF', fontSize: 24 } },
          label: { style: { fill: '#CECECE', fontSize: 14 }, formatter: (val) => { return val } }
        }
      })
      this.columnCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.columnCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
