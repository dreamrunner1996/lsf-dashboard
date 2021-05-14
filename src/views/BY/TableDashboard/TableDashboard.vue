<template>
  <div class="table-dashboard-content">
    <div class="content-header">
      <div class="img"><img :src="imgLogo" width="384" height="108" alt="#"></div>
      <div class="title">{{ title }}</div>
      <div class="none"></div>
    </div>
    <div class="content-body">
      <div class="body-item-row">
        <div class="ds-item ds-item-col1 ds-title">{{ lineTitle }}</div>
        <div class="ds-item ds-item-col1 ds-staff"
             v-for="item in staff"
             :key="item.id">
          <div class="ds-staff-ch">
            <span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.titleCh }}<span style="color: rgba(0, 0, 0, 0)">.</span>
          </div>
          <div class="ds-staff-en">
            <span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.titleEn }}<span style="color: rgba(0, 0, 0, 0)">.</span>
          </div>
          <div class="ds-staff-name">
            <span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.staffName }}<span style="color: rgba(0, 0, 0, 0)">.</span>
          </div>
        </div>
        <div class="ds-item ds-item-col1 ds-input">
          <div class="ds-input-ch">投入总量</div>
          <div class="ds-input-en">Input</div>
          <div class="ds-input-num">{{ inputNum }}</div>
        </div>
        <div class="ds-item ds-item-col1 ds-input">
          <div class="ds-input-ch">出勤人数</div>
          <div class="ds-input-en">Attendance</div>
          <div class="ds-input-num">{{ attendanceNum }}</div>
        </div>
        <div class="ds-item ds-item-col1 ds-input">
          <div class="ds-input-ch">目标产量</div>
          <div class="ds-input-en">Target</div>
          <div class="ds-input-num">{{ targetNum }}</div>
        </div>
        <div class="ds-item ds-item-col1 ds-input">
          <div class="ds-input-ch">实际产量</div>
          <div class="ds-input-en">Output</div>
          <div class="ds-input-num">{{ outputNum }}</div>
        </div>
        <div class="ds-item ds-item-col2 ds-information">
          <div class="ds-information-ch">订单号</div>
          <div class="ds-information-en">Order ID</div>
          <div class="ds-information-num">{{ orderId }}</div>
        </div>
        <div class="ds-item ds-item-col2 ds-information">
          <div class="ds-information-ch">机型</div>
          <div class="ds-information-en">Model Type</div>
          <div class="ds-information-num">{{ modelType }}</div>
        </div>
        <div class="ds-item ds-item-col2 ds-information">
          <div class="ds-information-ch">品名</div>
          <div class="ds-information-en">Product Name</div>
          <div class="ds-information-num">{{ productName }}</div>
        </div>
        <div class="ds-item ds-item-col2 ds-information">
          <div class="ds-information-ch">客户</div>
          <div class="ds-information-en">Customer</div>
          <div class="ds-information-num">{{ customer }}</div>
        </div>
      </div>
      <div class="ds-item date-time-card"><DateTime /></div>
      <div class="body-item-row-max">
        <div class="ds-item ds-item-col2 ds-table">
          <div class="ds-table-ch">时段</div>
          <div class="ds-table-en">Time</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">计划产量</div>
          <div class="ds-table-en">Plan</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">实际产量</div>
          <div class="ds-table-en">Output</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">不良数量</div>
          <div class="ds-table-en">Defect</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">差异值</div>
          <div class="ds-table-en">Different</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">完成率</div>
          <div class="ds-table-en">Finished</div>
        </div>
        <div class="ds-item ds-item-col2 ds-table">
          <div class="ds-table-ch">不良率</div>
          <div class="ds-table-en">Defective Fraction</div>
        </div>
        <div class="ds-item ds-item-col1 ds-table">
          <div class="ds-table-ch">维修</div>
          <div class="ds-table-en">Repair</div>
        </div>
      </div>
    </div>
    <div class="content-footer">
      <div :style="showTableData.length > 8 ? styleList.tableOverflow : {}">
        <div v-for="item in showTableData" :key="item.id" class="content-footer-row">
          <div v-if="item.offsetDay !== null" class="ds-item-col2" style="color: #FFFFFF">{{ item.time[0] }} - {{ item.time[1] }}</div>
          <div v-else class="ds-item-col2" style="color: #FFFFFF">休息</div>
          <div class="ds-item-col1" style="color: skyblue"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.plan }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col1" style="color: greenyellow"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.output }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col1" style="color: orange"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.defect }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col1" style="color: pink"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.different }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col1" style="color: peachpuff"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.finished }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col2" style="color: hotpink"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.defectiveFraction }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
          <div class="ds-item-col1" style="color: lightgray"><span style="color: rgba(0, 0, 0, 0)">.</span>{{ item.repair }}<span style="color: rgba(0, 0, 0, 0)">.</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './table-dashboard.css'
import Axios from 'axios'
import DateTime from '@/components/DateTime/DateTime'
import { notification } from 'ant-design-vue'

const imgLogo = require('@/assets/dash-logo.png')

export default {
  name: 'TableDashboard',
  components: { DateTime },
  data: () => ({
    tInterval: null,
    tOut1: null,
    tOut2: null,
    axiosUrl: '',
    imgLogo,
    styleList: {
      tableOverflow: {
        animation: 'table-overflow 20s infinite linear'
      }
    },
    title: '电子精益看板 (Lean Production Display)',
    lineTitle: '线名',
    staff: [
      { id: 1, titleCh: '', titleEn: '', staffName: '' },
      { id: 2, titleCh: '', titleEn: '', staffName: '' },
      { id: 3, titleCh: '', titleEn: '', staffName: '' }
    ],
    inputNum: 0,
    attendanceNum: 0,
    targetNum: 0,
    outputNum: 0,
    orderId: '',
    modelType: '',
    productName: '',
    customer: '',
    tableData: [
      { id: 1, time: ['', ''], startTime: 0, endTime: 0, plan: 0, input: 0, output: 0, defect: 0, different: 0, finished: '0%', defectiveFraction: '0%', repair: 0 }
    ],
    tableSimulateData: [],
    showTableData: [
      { id: 1, time: ['', ''], startTime: 0, endTime: 0, plan: 0, input: 0, output: 0, defect: 0, different: 0, finished: '0%', defectiveFraction: '0%', repair: 0 }
    ]
  }),
  created () {
    this.tInterval = true
    console.log(this.$route)
    this.axiosUrl = this.$route.query.datasource
  },
  mounted () {
    this.GetDisplayParam()
    this.GetDisplaySimulate()
    if (this.tInterval) {
      this.tOut1 = window.setInterval(this.GetDisplayParam, this.$root.$data.store.scanTime.table)
      this.tOut2 = window.setInterval(this.GetDisplaySimulate, this.$root.$data.store.scanTime.table)
    }
  },
  beforeDestroy () {
    this.tInterval = null
    window.clearInterval(this.tOut1)
    window.clearInterval(this.tOut2)
    this.tOut1 = null
    this.tOut2 = null
  },
  methods: {
    GetDisplayOutput () {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.product + '?datasource=' + this.axiosUrl).then(res => {
        console.error(res.data)
        if (res.data instanceof Array && res.data.length) {
          if (res.data[0].datasource === this.axiosUrl) {
            this.DialogDisplayOutput(res.data[0])
          } else {
            notification.error({
              message: '数据匹配错误',
              description: '面板数据与获取数据不匹配(data)'
            })
          }
        }
      })
    },
    GetDisplayParam () {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.displayParam + '?datasource=' + this.axiosUrl).then(res => {
        console.error(res.data)
        if (res.data && res.data instanceof Object) {
          if (res.data['showDatasource'] === this.axiosUrl) {
            this.DialogDisplayParam(res.data)
          } else {
            notification.error({
              message: '数据匹配错误',
              description: '面板数据与获取数据不匹配(param)'
            })
          }
        }
      }).then(() => this.GetDisplayOutput())
    },
    GetDisplaySimulate () {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.simulate + '?datasource=' + this.axiosUrl).then(res => {
        console.error(res.data)
        if (res.data && res.data instanceof Array && res.data.length) {
          if (res.data[0].datasource === this.axiosUrl) {
            this.DialogSimulate(res.data[0].data)
          } else {
            notification.error({
              message: '数据匹配错误',
              description: '面板数据与获取数据不匹配(mockParam)'
            })
          }
        }
      })
    },
    DialogDisplayOutput (resData) {
      let getData = JSON.parse(JSON.stringify(resData.data))
      if (getData instanceof Array && getData.length) {
        this.outputNum = 0
        this.inputNum = 0
        getData.forEach(res => {
          let okNum = 0
          let repairNum = 0
          let ngNum = 0
          let inpNum = 0
          if (res && res['categoryList'] instanceof Array) {
            if (res['categoryList'].length) {
              res['categoryList'].forEach(res1 => {
                if (res1.type === 'SmallBox' || res1.type === 'Null') {
                  if (res1.status === 'Ok') okNum += res1.count
                  if (res1.status === 'Repair') repairNum += res1.count
                  if (res1.status === 'Ng') ngNum += res1.count
                  if (res1.status === 'Input') inpNum += res1.count
                }
              })
              this.tableData.forEach(res2 => {
                if (res2.startTime === res.startTime && res2.endTime === res.endTime) {
                  res2.output = okNum
                  res2.defect = ngNum
                  res2.repair = repairNum
                  res2.input = inpNum
                  res2.different = (res2.plan - okNum) > 0 ? res2.plan - okNum : 0
                  // res2.different = (res2.plan - inpNum) > 0 ? res2.plan - inpNum : 0
                  res2.finished = (okNum * 100 / res2.plan).toFixed(0) + '%'
                  res2.defectiveFraction = (okNum + ngNum + repairNum) === 0 ? '0%' : (ngNum * 100 / (okNum + ngNum + repairNum)).toFixed(2) + '%'
                  this.outputNum += okNum
                  this.inputNum += inpNum
                }
              })
            }
          }
          okNum = null
          repairNum = null
          ngNum = null
          inpNum = null
        })
      }
      getData = null
      this.showTableData = this.tableData
    },
    DialogDisplayParam (resData) {
      let getData = JSON.parse(JSON.stringify(resData))
      this.imgLogo = getData.logoPath
      this.lineTitle = getData.group.name
      this.title = getData.title
      if (getData.staff && getData.staff instanceof Array && getData.staff.length) {
        this.staff = []
        getData.staff.forEach((res, index) => {
          this.staff.push({ id: index + 1, titleCh: res.titleCh, titleEn: res.titleEn, staffName: res.name })
        })
      }
      while (this.staff.length < 3) { this.staff.push({ id: this.staff.length + 1, titleCh: '', titleEn: '', staffName: '' }) }
      while (this.staff.length > 3) { this.staff.shift() }
      this.attendanceNum = getData['attendanceAll']
      let targetAll = 0
      if (getData['dataSlot'] instanceof Array && getData['dataSlot'].length) {
        this.tableData = []
        getData['dataSlot'].forEach((res, index) => {
          targetAll += res.target
          this.tableData.push({
            id: index + 1,
            offsetDay: res.offsetDay,
            time: res.offsetDay !== null ? res.time : res.time,
            plan: res.offsetDay !== null ? res.target : '',
            startTime: this.TimeToTimeStamp(res.time[0], res.offsetDay === null ? 0 : res.offsetDay),
            endTime: this.TimeToTimeStamp(res.time[1], res.offsetDay === null ? 0 : res.offsetDay),
            output: res.offsetDay !== null ? 0 : '',
            input: res.offsetDay !== null ? 0 : '',
            defect: res.offsetDay !== null ? 0 : '',
            different: res.offsetDay !== null ? 0 : '',
            finished: res.offsetDay !== null ? '0%' : '',
            defectiveFraction: res.offsetDay !== null ? '0%' : '',
            repair: res.offsetDay !== null ? 0 : ''
          })
        })
      }
      console.log(this.showTableData)
      this.targetNum = targetAll
      this.orderId = getData.orderCode
      this.modelType = getData.productModel
      this.productName = getData.productName
      this.customer = getData.orderCustomer
      targetAll = null
      getData = null
    },
    DialogSimulate (resData) {
      let getData = JSON.parse(JSON.stringify(resData))
      if (this.tableData.length && getData.length) {
        this.tableSimulateData = []
        this.tableData.forEach(res => {
          let getSimulateData = getData.find(res1 => { return (res.endTime === res1.endTime && res.startTime === res1.startTime) })
          if (getSimulateData) {
            this.tableSimulateData.push({ id: this.tableSimulateData.length, time: ['', ''], startTime: 0, endTime: 0, plan: 0, input: 0, output: 0, defect: 0, different: 0, finished: '0%', defectiveFraction: '0%', repair: 0 })
          }
          getSimulateData = null
        })
      }
      getData = null
    },
    TimeToTimeStamp (time, offsetDay) {
      let date = new Date()
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}-`
      const day = date.getDate() - offsetDay
      const hourMinute = `${time}:00`
      date = null
      return new Date(`${yearMonth}${day} ${hourMinute}`).getTime()
    }
  }
}
</script>

<style scoped>

</style>
