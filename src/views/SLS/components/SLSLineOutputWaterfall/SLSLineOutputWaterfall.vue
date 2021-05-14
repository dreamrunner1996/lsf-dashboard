<template>
  <div class="sls-line-output-waterfall-content">
    <div class="sls-line-output-waterfall-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Waterfall } from '@antv/g2plot'
import './sls-line-output-waterfall.css'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'SLSLineOutputWaterfall',
  data: () => ({
    waterfallCanvas: null,
    oldData: [],
    nowTimeEnd: null,
    offsetVal1: 0,
    offsetVal2: 0,
    offsetVal: 0
  }),
  watch: {
    chartData: function (arrVal) {
      if (this.oldData.length !== arrVal.length) {
        if (this.waterfallCanvas) {
          this.waterfallCanvas.destroy()
          this.waterfallCanvas = null
        }
        this.CreateCanvas(this.chartId, this.DialogArrVal(arrVal))
        this.oldData = JSON.parse(JSON.stringify(arrVal))
      } else {
        this.UpdateCanvas(this.DialogArrVal(arrVal))
      }
    }
  },
  mounted: function () {
    this.CreateCanvas(this.chartId, this.DialogArrVal(this.chartData))
  },
  methods: {
    // 格式化数据
    DialogArrVal: function (dataList = []) {
      const dataArr = []
      if (dataList.length) {
        dataList.forEach((dataRes, dataIndex) => {
          if (dataIndex === 0) {
            dataArr.push({ time: `${dataRes.startTime.time}`, output: 0, first: true })
          }
          if (dataRes.now) {
            this.nowTimeEnd = dataRes.endTime.time
            dataArr.push({time: dataRes.endTime.time, output: dataRes.output, now: true})
          }
          else dataArr.push({ time: dataRes.endTime.time, output: dataRes.output })
        })
      }
      return dataArr
    },
    // 创建 canvas
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.waterfallCanvas = null
      }
      this.waterfallCanvas = new Waterfall(chartId, {
        data: chartData,
        appendPadding: [20, 10, 0, 0],
        xField: 'time',
        yField: 'output',
        tooltip: false,
        meta: {
          output: { alias: '时间' },
          value: { alias: '产出量', formatter: (v) => `${v}` }
        },
        legend: false,
        total: { label: '总量' },
        leader: { lineWidth: 1, stroke: '#FFFFFF', lineDash: [2, 2] },
        color: (item) => {
          if (item.time === '总量') { return '#E38035' }
          if (item.time === this.nowTimeEnd) { return '#97F489' }
          return item.output > 0 ? '#1596F4' : '#FFFFFF'
        },
        yAxis: {
          grid: { line: null },
          offsetX: 35,
          min: 0,
          label: {
            style: { fill: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
            formatter: (val) => { return val }
          }
        },
        xAxis: {
          line: null,
          offsetX: 35,
          grid: { line: null },
          label: {
            style: { fill: '#FFFFFF', fontSize: 14, fontWeight: 'bold', rotate: 30 },
            formatter: (val, item, index) => {
              if (index === 0) this.offsetVal1 = item.point.x
              if (index === 1) {
                this.offsetVal2 = item.point.x
                this.offsetVal = ((this.offsetVal2 - this.offsetVal1) / 2).toFixed(0) * 1
              }
              return val
            },
            autoHide: false,
            autoRotate: true
          }
        },
        label: {
          style: { fontSize: 18, fill: '#FFFFFF', fontWeight: 'bold' },
          formatter: function (val) {
            if (val.time === '总量') return val.output
            else return ''
            // if (val.now) return `> ${val.output} <`
            // else if (val.first) return ''
            // else return `${val.output}`
          }
        }
      })
      this.waterfallCanvas.render()
      this.waterfallCanvas.update({
        xAxis: { offsetX: this.offsetVal }
      })
    },
    // 更新 canvas
    UpdateCanvas: function (chartData) {
      this.waterfallCanvas.changeData(chartData)
    },
    // 获取 表格最大值
    yAxisValueMax: function (chartData) {
      chartData.forEach(chartDataRes => {
        if (chartDataRes.target > this.maxVal) this.maxVal = chartDataRes.target + 10
        if (chartDataRes.output > this.maxVal) this.maxVal = chartDataRes.output + 10
      })
    }
  }
}
</script>

<style scoped>

</style>
