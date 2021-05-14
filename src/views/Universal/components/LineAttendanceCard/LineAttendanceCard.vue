<template>
  <div class="line-attendance-card-content">
<!--    <div class="line-attendance-card-title-description">-->
<!--      <div class="line-attendance-card-title">{{ title }}</div>-->
<!--      <div class="line-attendance-card-description">{{ description }}</div>-->
<!--    </div>-->
    <div class="line-attendance-card-canvas" :id="chartId" />
    <div class="line-attendance-card-details">
      <div class="line-attendance-card-details-item"
           v-for="chartDataItem in chartData"
           :key="'chart-data-attendance-item-' + chartDataItem.type">
        <div class="line-attendance-card-details-item-title">{{ chartDataItem.type }}</div>
        <div class="line-attendance-card-details-item-value">{{ chartDataItem.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pie } from '@antv/g2plot'
import './line-attendance-card.css'

export default {
  name: 'LineAttendanceCard',
  props: {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    data: { type: Object, default: () => ({}) },
    chartId: { type: String, default: '' },
    chartData: { type: Array, default: () => ([]) }
  },
  data: () => ({
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
      if (document.getElementById(chartId).innerHTML) document.getElementById(chartId).innerHTML = null
      this.pieCanvas = new Pie(chartId, {
        appendPadding: 10,
        data: chartData,
        animation: false,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: {
          position: 'right',
          offsetX: -20,
          offsetY: 10,
          itemName: { style: { fill: '#FFFFFF', fontSize: 20 } }
        },
        label: {
          type: 'inner',
          offset: '-50%',
          content: '{value}',
          style: { textAlign: 'center', fontSize: 18, fill: 'black', fontWeight: 'bold' }
        },
        color: ['skyblue', '#61E658', '#D9E658', '#E93636', 'pink', '#FFFFFF', '#FFFFFF'],
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        statistic: {
          title: false,
          content: {
            style: { whiteSpace: 'pre-wrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 24, color: '#AEAEAE' },
            formatter: () => '出勤详细'
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

<style scoped>

</style>
