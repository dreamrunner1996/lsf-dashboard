<template>
  <div class="sls-line-output-line-content">
    <div class="sls-line-output-line-canvas" :id="chartId" />
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import './sts-line-output-line.css'

export default {
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Array }
  },
  name: 'SLSLineOutputLine',
  data: () => ({
    lineCanvas: null,
    oldData: [],
    // yMax: 10,
    nowTimeEnd: null,
    offsetVal1: 0,
    offsetVal2: 0,
    offsetVal: 0
  }),
  watch: {
    chartData: function (arrVal) {
      // if (arrVal.find(arrRes => (arrRes.now === true))) {
      //   this.yMax = arrVal.find(arrRes => (arrRes.now === true)).output + 10
      //   if (!this.yMax) this.yMax = 10
      //   console.log(this.yMax)
      // }
      if (this.oldData.length !== arrVal.length) {
        if (this.lineCanvas) {
          this.lineCanvas.destroy()
          this.lineCanvas = null
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
          /* line left one step */
          if (dataIndex === 0) {
            dataArr.push({ time: `${dataRes.startTime.time}`, value: 0, output: 0, status: 'first' })
          }
          if (dataRes.now) {
            this.nowTimeEnd = dataRes.endTime.time
            dataArr.push({ time: dataRes.endTime.time, value: dataRes.value, output: dataRes.output, status: 'now' })
          } else if (dataRes.late) {
            dataArr.push({ time: dataRes.endTime.time, value: dataRes.value, output: null, status: 'late' })
          } else {
            dataArr.push({ time: dataRes.endTime.time, value: dataRes.value, output: dataRes.output })
          }

          // if (dataIndex === 0) {
          //   dataArr.push({ time: ``, value: 0, output: 0, status: 'first' })
          // }
          // if (dataRes.now) {
          //   this.nowTimeEnd = dataRes.startTime.time
          //   dataArr.push({ time: dataRes.startTime.time, value: dataRes.value, output: dataRes.output, status: 'now' })
          // } else if (dataRes.late) {
          //   dataArr.push({ time: dataRes.startTime.time, value: dataRes.value, output: null, status: 'late' })
          // } else {
          //   dataArr.push({ time: dataRes.startTime.time, value: dataRes.value, output: dataRes.output })
          // }
        })
      }
      return dataArr
    },
    // 创建 canvas
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.lineCanvas = null
      }
      this.lineCanvas = new Line(chartId, {
        data: chartData,
        appendPadding: [20, 10, 0, 0],
        animation: false,
        xField: 'time',
        yField: 'output',
        tooltip: false,
        label: {
          content: (chartDataRes) => {
            if (chartDataRes.status === 'late' || chartDataRes.status === 'first') return null
            else return chartDataRes.output
          },
          style: { fill: '#1596F4', fontWeight: 'bold', fontSize: 18 },
          offsetY: -15,
          offsetX: -15
        },
        yAxis: {
          grid: { line: null },
          min: 0,
          label: {
            style: { fill: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
            formatter: (val) => { return val }
          }
        },
        xAxis: {
          grid: { line: null },
          label: {
            style: { fill: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
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
        lineStyle: {},
        point: {
          shape: (item) => {
            if (item.time === this.nowTimeEnd) return 'circle'
            else return 'circle'
          },
          size: (item) => {
            if (item.time === this.nowTimeEnd) return 10
            else return 5
          },
          style: (item) => {
            if (item.time === this.nowTimeEnd) return { fill: '#97F489', stroke: '#97F489', lineWidth: 2,  }
            else return { fill: '#1596F4', stroke: '#1596F4', lineWidth: 2 }
          }
          // style: { fill: '#1596F4', stroke: '#1596F4', lineWidth: 2 }
        }
      })
      this.lineCanvas.render()
      this.lineCanvas.update({
        xAxis: { offsetX: this.offsetVal }
      })
    },
    // 更新 canvas
    UpdateCanvas: function (chartData) {
      // this.lineCanvas.update({
      //   yAxis: { max: this.yMax }
      // })
      this.lineCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
