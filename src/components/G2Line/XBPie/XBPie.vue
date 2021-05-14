<template>
  <div class="xb-pie-content">
    <h1>{{ title }}</h1>
    <div :id="chartId"></div>
  </div>
</template>

<script>
import './xb-pie.css'
import { Pie } from '@antv/g2plot'

export default {
  props: {
    chartId: { type: String, required: true },
    chartData: { type: Array, required: true },
    title: { type: String, required: true }
  },
  name: 'Pie',
  data: () => ({
    pieTable: null
  }),
  watch: {
    chartData: function (newVal) {
      this.pieTable.destroy()
      this.pieTable = null
      this.CreateCanvas(newVal)
      this.pieTable.render()
    }
  },
  mounted () {
    // this.GetDataMax(this.chartData)
    this.CreateCanvas(this.chartData)
    this.pieTable.render()
  },
  methods: {
    CreateCanvas (dataList) {
      let getElement = document.getElementById(this.chartId)
      this.pieTable = new Pie(getElement, {
        autoFit: false,
        animation: false,
        width: 460,
        height: 400,
        padding: 'auto',
        data: dataList,
        angleField: 'value',
        colorField: 'name',
        radius: .7,
        label: {
          type: 'inner',
          offset: '-0.5',
          // content: '{name} {percentage}',
          content: ({ name, percent }) => { return `${name} ${(percent*100).toFixed(0)}%` },
          style: {
            fill: '#fff',
            fontSize: 14,
            textAlign: 'center'
          }
        },
        tooltip: false,
        legend: false,
        pieStyle: ({ name }) => {
          if (name === '已生产') return { fill: 'rgb(6, 192, 95)' }
          else if (name === '待生产') return { fill: 'rgb(233, 108, 91)' }
          else if (name === '合格') return { fill: 'rgb(6, 192, 95)' }
          else if (name === '不合格') return { fill: 'rgb(233, 108, 91)' }
        }
      })
      getElement = null
    }
  }
}
</script>

<style scoped>

</style>
