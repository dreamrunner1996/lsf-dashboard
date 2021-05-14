<template>
  <div class="xb-column-content">
    <h1>{{ title }}</h1>
    <div :id="chartId"></div>
  </div>
</template>

<script>
import './xb-column.css'
import { Column } from '@antv/g2plot'

export default {
  props: {
    chartId: { type: String, required: true },
    chartData: { type: Array, required: true },
    title: { type: String, required: true }
  },
  name: 'XBColumn',
  data: () => ({
    columnTable: null
  }),
  watch: {
    chartData: function (newVal) {
      this.columnTable.destroy()
      this.columnTable = null
      this.CreateCanvas(newVal)
      this.columnTable.render()
    }
  },
  mounted () {
    // this.GetDataMax(this.chartData)
    this.CreateCanvas(this.chartData)
    this.columnTable.render()
  },
  methods: {
    CreateCanvas (dataList) {
      let getElement = document.getElementById(this.chartId)
      this.columnTable = new Column(getElement, {
        data: dataList,
        autoFit: false,
        animation: false,
        height: 400,
        width: 600,
        xField: 'time',
        yField: 'value',
        label: {
          position: 'middle',
          style: { fontWeight: 'bold', fill: 'black' },
          formatter: (val) => { return val.value + '%' }
        },
        yAxis: {
          min: 0,
          max: 100,
          line: {
            style: { stroke: '#444444', lineWidth: 2 }
          },
          title: {
            text: '完成率',
            style: { fill: 'black', fontSize: 24 }
          },
          label: {
            style: { fill: '#444444', fontSize: 14 },
            formatter: (val) => { return val+'%' }
          }
        },
        xAxis: {
          tickInterval: 1,
          label: {
            autoHide: false,
            style: { fill: '#444444', fontSize: 12 }
          },
          line: {
            style: { stroke: '#444444', lineWidth: 2 }
          }
        },
        color: 'rgb(6, 225, 122)',
        legend: {
          position: 'top-right'
        }
      })
      getElement = null
    }
  }
}
</script>

<style scoped>

</style>
