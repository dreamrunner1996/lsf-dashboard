<template>
  <div class="xb-dual-axes-content">
    <h1>{{ title }}</h1>
    <div :id="chartId"></div>
  </div>
</template>

<script>
import './xb-dual-axes.css'
import { DualAxes } from '@antv/g2plot'

export default {
  props: {
    chartId: { type: String, required: true },
    chartData: { type: Array, required: true },
    title: { type: String, required: true }
  },
  name: 'XBDualAxes',
  data: () => ({
    dualTable: null,
    maxNum: 0
  }),
  watch: {
    chartData: function (newVal) {
      this.GetDataMax(newVal)
      this.dualTable.destroy()
      this.dualTable = null
      this.CreateCanvas(newVal)
      this.dualTable.render()
    }
  },
  mounted () {
    this.GetDataMax(this.chartData)
    this.CreateCanvas(this.chartData)
    this.dualTable.render()
  },
  methods: {
    CreateCanvas (dataList) {
      let getElement = document.getElementById(this.chartId)
      this.dualTable = new DualAxes(getElement, {
        data: [dataList, dataList],
        autoFit: false,
        animation: false,
        height: 400,
        width: 600,
        legend: {
          position: 'top-right',
          itemName: {
            formatter: (val) => {
              if (val === 'output') return '产出数量'
              if (val === 'order') return '目标量'
            }
          }
        },
        xField: 'time',
        yField: ['output', 'order'],
        yAxis: [
          {
            min: 0,
            max: this.maxNum,
            line: {
              style: { stroke: '#444444', lineWidth: 2 }
            },
            title: {
              text: '产能',
              style: { fill: 'black', fontSize: 24 }
            },
            label: {
              style: { fill: '#444444', fontSize: 14 }
            }
          },
          {
            min: 0,
            max: this.maxNum,
            label: {
              formatter: () => ''
            }
          }
        ],
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
        geometryOptions: [
          {
            geometry: 'column',
            color: 'rgb(6, 225, 122)',
            label: { position: 'middle', style: { fill: "black", fontWeight: 'bold' } }
          },
          {
            geometry: 'line',
            label: { align: 'top', style: { fill: 'orangered' } },
            point: { size: 3, style: { fill: 'orangered', stroke: 'orangered', lineWidth: 2 } },
            color: 'orangered',
            lineStyle: { lineWidth: 2, stroke: 'orangered' }
          }
        ]
      })
      getElement = null
    },
    GetDataMax (dataList) {
      this.maxNum = 100
      dataList.forEach(res => {
        this.maxNum = res.order > this.maxNum ? res.order : this.maxNum
        this.maxNum = res.output > this.maxNum ? res.output : this.maxNum
      })
    }
  }
}
</script>

<style scoped>

</style>
