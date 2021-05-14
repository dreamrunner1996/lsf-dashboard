<template>
  <div class="line-clear-attendance-card-content">
    <div class="line-clear-attendance-card-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Pie } from '@antv/g2plot'
import './line-clear-attendance-card.css'

export default {
  name: 'LineClearAttendanceCard',
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  data: () => ({
    allNum: 0,
    pieCanvas: null,
    oldData: []
  }),
  watch: {
    chartData: function (newVal) {
      if (this.oldData.length !== newVal.length) {
        if (this.pieCanvas) {
          this.pieCanvas.destroy()
          this.pieCanvas = null
        }
        this.CreateCanvas(this.chartId, newVal)
        this.oldData = JSON.parse(JSON.stringify(newVal))
      } else {
        this.UpdateCanvas(newVal)
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
        this.pieCanvas = null
      }
      this.allNum = 0
      this.chartData.forEach(chartDataRes => {
        this.allNum += chartDataRes.value
      })
      this.pieCanvas = new Pie(chartId, {
        appendPadding: 10,
        width: 330,
        height: 230,
        autoFit: false,
        data: chartData,
        animation: false,
        angleField: 'value',
        colorField: 'name',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          position: 'right',
          offsetX: -20,
          offsetY: 10,
          itemName: { style: { fill: '#2c2c2c', fontWeight: 'bold', fontSize: 16 } }
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: { textAlign: 'center', fontSize: 18, fill: 'black', fontWeight: 'bold' }
        },
        color: ['#61E658', '#D9E658', 'pink', 'purple', '#E91212', '#2c2c2c', '#2c2c2c'],
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 24, color: '#4b4b4b' },
            formatter: () => `共 ${this.allNum} 人`
          }
        }
      })
      this.pieCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.pieCanvas.changeData(chartData)
    }
  }
}
</script>
