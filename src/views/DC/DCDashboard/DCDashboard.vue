<template>
  <div class="dc-dashboard-content">
    <div class="dashboard-header">
      <div class="logo-content">
        <img class="logo" :src="DCLogo" alt="logo" width="226px" height="113px" />
      </div>
      <div class="title-content">
        <div class="title-ch">{{ titleCh }}</div>
        <div class="title-en">{{ titleEn }}</div>
      </div>
      <div class="line-name">{{ lineName }}</div>
      <div class="time-content">
<!--        <div class="time-line-delay">产品间隔时间: {{ scanTime }}</div>-->
        <div class="time">当前时间: {{ time }}</div>
      </div>
<!--      <div class="product-content">-->
<!--        <img class="product-img" :src="PDLogo" alt="product-logo" />-->
<!--      </div>-->
    </div>
    <div class="dashboard-body">
      <div class="dashboard-body-left">
        <div class="staff-content">
          <div class="staff-item" v-for="item in staffData" :key="'staffItem' + item.id">
            <div class="staff-logo">
              <img :src="item.logo" alt="header image" />
            </div>
            <div class="staff-information">
              <div class="staff-information-work">
                <div class="staff-information-work-title">{{ item.titleCh | staffDisplay(item.titleEn) }}</div>
                <div class="staff-information-work-name">{{ item.name ? item.name : '-' }}</div>
              </div>
              <div class="staff-information-phone">
                <div class="staff-information-phone-title">电话</div>
                <div class="staff-information-phone-number">{{ item.contact ? item.contact : '-' }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="note-content">
          <div class="note-title">注意事项</div>
          <div class="note-context">
            <pre style="font-size: 20px; padding: 10px 0">{{ description }}</pre>
            <div class="note-item" v-for="item in noteList" :key="'noteItem'+item.id">
              <div>{{ item.id }}:</div>
              <div>{{ item.context }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard-body-right">
        <div class="table-content">
          <table cellspacing="1" cellpadding="1">
            <tr>
              <td v-for="item in tableData" :key="'tableDataItem' + item.id">
                <div class="table-title-ch">{{ item.tableTitleCh }}</div>
                <div class="table-title-en">{{ item.tableTitleEn }}</div>
              </td>
            </tr>
            <tr>
              <td v-for="item in tableData" :key="'tableDataValue' + item.id">
                <div class="table-item-context">{{ item.value }}</div>
                <div v-if="item.secValue"> - </div>
                <div class="table-item-context" v-if="item.secValue">
                  {{ item.secValue }}
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div class="data-content">
          <div class="data-content-table">
            <table>
              <tr>
                <th>时间段</th>
                <th>数量</th>
                <th>目标</th>
                <th>差异</th>
              </tr>
              <tr v-for="item in tableListData" :key="'tableListItem' + item.id">
                <td :style="item.output > item.plan ? styleList.unTarget : {}">
                  <span style="color: orangered">{{ item.offsetDay | offsetShow }}</span>
                  {{ `${item.time[0]} - ${item.time[1]}` }}
                </td>
                <td :style="item.output > item.plan ? styleList.unTarget : {}">{{ item.output }}</td>
                <td :style="item.output > item.plan ? styleList.unTarget : {}">{{ item.plan }}</td>
                <td :style="item.output > item.plan ? styleList.unTarget : {}">{{ item.difficult }}</td>
              </tr>
            </table>
          </div>
          <div class="data-content-column-line">
            <div id="data-column-line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './dc-dashboard.css'
import { DualAxes } from '@antv/g2plot'
import Axios from 'axios'
import { notification } from 'ant-design-vue'

const DCLogo = require('./../../../assets/dc-logo.png')
const PDLogo = require('./../../../assets/product-logo.png')
const unTarget = {
  color: 'red'
}

export default {
  name: 'DCDashboard',
  data: () => ({
    DCLogo,
    PDLogo,
    tInterval: null,
    tOut1: null,
    tOut2: null,
    dualAxes: null,
    dualAxesNum: 0,
    styleList: { unTarget },
    axiosUrl: '',
    titleCh: '生产线管理看板',
    titleEn: 'Production line information public column',
    lineName: 'J线',
    productScanTime: 0,
    time: '2020/11/09  14:29:26',
    staffData: [
      { id: 0, titleCh: '组长', titleEn: '', name: 'XXX', contact: '13198765432', logo: '' },
      { id: 1, titleCh: '拉长', titleEn: '', name: 'XXX', contact: '13312345678', logo: '' }
    ],
    tableData: [
      { id: 0, tableTitleCh: '订单号', tableTitleEn: 'Purchase Order', value: '', secValue: '' },
      { id: 1, tableTitleCh: '客户', tableTitleEn: 'Customer', value: '', secValue: '' },
      { id: 2, tableTitleCh: '产品名', tableTitleEn: 'Part Name', value: '', secValue: '' },
      { id: 3, tableTitleCh: '规格型号', tableTitleEn: 'Specification', value: '', secValue: '' },
      { id: 4, tableTitleCh: '计划数量', tableTitleEn: 'Planned quantity', value: 0, secValue: '' },
      { id: 5, tableTitleCh: '完成数量', tableTitleEn: 'Completion quantity', value: 0, secValue: '' },
      { id: 6, tableTitleCh: '完成率', tableTitleEn: 'Completion', value: '0.00%', secValue: '' }
    ],
    tableListData: [
      { id: 0, time: ['', ''], timeString: '', startTime: 0, endTime: 0, plan: 0, input: 0, output: 0, defect: 0, finished: '0%', number: 132, order: 120, difficult: 12, defectiveFraction: '0%', repair: 0 }
    ],
    noteList: [],
    description: '',
    DualData: []
  }),
  computed: {
    scanTime: function () {
      if (this.productScanTime < 0 || this.productScanTime === 0) return '0分0秒'
      const scanMin = parseInt((this.productScanTime / 60).toString())
      const scanSec = this.productScanTime % 60 < 10 ? '0' + this.productScanTime % 60 : this.productScanTime % 60
      return `${scanMin}分${scanSec}秒`
    }
  },
  filters: {
    staffDisplay: function (ch, en) {
      if (ch && en) return `${ch}(${en})`
      else if (ch) return ch
      else if (en) return en
      else return '-'
    },
    offsetShow: function (val) {
      if (val === 0) { return '' }
      else if (val === -1) { return '昨天' }
      else if (val === 1) { return '明天' }
      else if (val < -1) { return `前${val}天` }
      else if (val > 1) { return `后${val}天` }
      else { return '休息' }
    }
  },
  created () {
    this.tInterval = true
    this.axiosUrl = this.$route.query.datasource
  },
  mounted () {
    this.UpdateTime()
    this.GetDisplayParam()
    if (this.tOut1) window.clearInterval(this.tOut1)
    this.tOut1 = window.setInterval(this.GetDisplayParam, this.$root.$data.store.scanTime.table)
    if (this.tOut2) window.clearInterval(this.tOut2)
    this.tOut2 = window.setInterval(this.UpdateTime, 1000)
    this.CreateCanvas()
  },
  beforeDestroy () {
    this.tInterval = null
    window.clearInterval(this.tOut1)
    window.clearInterval(this.tOut2)
    this.tOut1 = null
    this.tOut2 = null
  },
  methods: {
    GetDisplayParam () {
      // console.log(this.$root.$data.store.devUrl + this.$root.$data.store.displayParam + '?datasource=' + this.axiosUrl)
      // Axios.get('http://127.0.0.1:1234/dc/param').then(res => {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.displayParam + '?datasource=' + this.axiosUrl).then(res => {
        console.log(res.data)
        if (res.data['showDatasource']) {
          if (res.data['showDatasource'] && res.data['showDatasource'] === this.axiosUrl) {
            this.DialogDisplayOutput(res.data)
            // this.dualAxes.destroy()
            // this.dualAxes = null
            this.dualAxesMax(this.tableListData)
            // this.CreateCanvas()
            this.GetDisplayData()
          } else {
            notification.error({
              message: '数据匹配错误',
              description: '面板数据与获取数据不匹配(data)'
            })
          }
        }
      })
    },
    DialogDisplayOutput (resData) {
      let getData = JSON.parse(JSON.stringify(resData))
      this.titleCh = getData.title
      this.titleEn = 'Production line information public column'
      this.lineName = getData.group ? getData.group.name : '产线'
      this.description = getData.description ? getData.description : ''
      this.productScanTime = getData.group ? getData.group['productScanTime'] ? getData.group['productScanTime'] : 0 : 0
      let tableValue = [getData.orderCode, getData.orderCustomer, getData.productName, getData.productSpec, getData['dataTarget'], 0, '0%']
      let tableSecValue = ['', '', '', getData.productModel, '', '', '']
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].value = tableValue[i]
        this.tableData[i].secValue = tableSecValue[i]
      }
      this.DCLogo = getData.logoPath
      this.PDLogo = getData['productPath']
      // { id: 0, time: ['', ''], startTime: 0, endTime: 0, plan: 0, input: 0, output: 0, defect: 0, finished: '0%', number: 132, order: 120, different: 12, defectiveFraction: '0%', repair: 0 }
      if (getData['dataSlot'] && getData['dataSlot'] instanceof Array && getData['dataSlot'].length) {
        this.tableListData = []
        getData['dataSlot'].forEach((dataSlotRes, dataSlotIndex) => {
          this.tableListData.push({
            id: dataSlotIndex + 1,
            offsetDay: dataSlotRes.offsetDay,
            time: dataSlotRes.offsetDay !== null ? dataSlotRes.time : dataSlotRes.time,
            plan: dataSlotRes.offsetDay !== null ? dataSlotRes.target : '',
            startTime: this.TimeToTimeStamp(dataSlotRes.time[0], dataSlotRes.offsetDay === null ? 0 : dataSlotRes.offsetDay),
            endTime: this.TimeToTimeStamp(dataSlotRes.time[1], dataSlotRes.offsetDay === null ? 0 : dataSlotRes.offsetDay),
            timeString: dataSlotRes.offsetDay !== null ? `${dataSlotRes.time[0]}-${dataSlotRes.time[1]}` : '休息',
            output: dataSlotRes.offsetDay !== null ? 0 : '',
            input: dataSlotRes.offsetDay !== null ? 0 : '',
            defect: dataSlotRes.offsetDay !== null ? 0 : '',
            difficult: dataSlotRes.offsetDay !== null ? 0 : '',
            finished: dataSlotRes.offsetDay !== null ? '0%' : '',
            defectiveFraction: dataSlotRes.offsetDay !== null ? '0%' : '',
            repair: dataSlotRes.offsetDay !== null ? 0 : ''
          })
        })
      }
      if (getData.staff && getData.staff instanceof Array && getData.staff.length) {
        this.staffData = []
        getData.staff.forEach((res, index) => {
          this.staffData.push({ id: index, titleEn: res.titleEn, titleCh: res.titleCh, name: res.name, contact: res.contact, logo: res.image ? res.image : null })
        })
      }
      while (this.staffData.length !== 2) {
        if (this.staffData.length > 2) this.staffData.shift()
        else this.staffData.push({ id: this.staffData.length, titleEn: '-', titleCh: '-', name: '-', contact: '-', logo: null })
      }
      tableValue = null
    },
    GetDisplayData () {
      // console.log(this.$root.$data.store.devUrl + this.$root.$data.store.product + '?datasource=' + this.axiosUrl)
      // Axios.get('http://127.0.0.1:1234/dc/data').then(res => {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.product + '?datasource=' + this.axiosUrl).then(res => {
        if (res.data && res.data instanceof Array && res.data.length) {
          const resData = res.data[0]
          if (resData['datasource'] && resData['datasource'] === this.axiosUrl) {
            this.DialogDisplayData(resData.data)
            this.dualAxes.destroy()
            this.dualAxes = null
            this.CreateCanvas()
          }
        }
      })
    },
    DialogDisplayData (resData) {
      const getData = JSON.parse(JSON.stringify(resData))
      getData.forEach(getDataRes => {
        this.tableListData.forEach(tableListRes => {
          if (getDataRes !== null && getDataRes.startTime === tableListRes.startTime && getDataRes.endTime === tableListRes.endTime) {
            let output = 0
            let poor = 0
            getDataRes['categoryList'].forEach(res2 => {
              switch (res2.status) {
                case 'Ng': poor += res2.count; break
                default: output += res2.count; break
              }
            })
            tableListRes.output = output
            tableListRes.poor = poor
            tableListRes.difficult = tableListRes.plan - output < 0 ? 0 : tableListRes.plan - output
            tableListRes.percent = (output * 100 / (output + poor)).toFixed(0) + '%'
          }
        })
      })
      // 计划数量, 完成数量, 完成率
      this.tableData[4].value = 0
      this.tableData[5].value = 0
      this.tableData[6].value = '0%'
      this.tableListData.forEach(tableRes => {
        this.tableData[4].value += tableRes.plan
        this.tableData[5].value += tableRes.output
      })
      this.tableData[6].value = ((this.tableData[5].value * 100) / this.tableData[4].value).toFixed(2) + '%'

      console.error(this.tableData)
      console.error(this.tableListData)
    },
    UpdateTime () {
      let date = new Date()
      switch (date.getDay()) {
        case 0: { this.week = '周日'; break }
        case 1: { this.week = '周一'; break }
        case 2: { this.week = '周二'; break }
        case 3: { this.week = '周三'; break }
        case 4: { this.week = '周四'; break }
        case 5: { this.week = '周五'; break }
        case 6: { this.week = '周六'; break }
        default: { this.week = '-'; break }
      }
      this.time = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
      date = null
    },
    CreateCanvas () {
      this.dualAxes = new DualAxes('data-column-line', {
        width: 1000,
        height: 700,
        autoFit: false,
        animation: false,
        data: [this.tableListData, this.tableListData],
        xField: 'timeString',
        yField: ['output', 'plan'],
        legend: {
          position: 'top-right',
          itemName: {
            formatter: (val) => {
              if (val === 'output') return '产量'
              if (val === 'plan') return '目标量'
            }
          }
        },
        xAxis: {
          tickInterval: 1,
          line: { style: { stroke: '#000000', lineWidth: 2 } },
          label: { autoHide: false, style: { fontSize: 14, fontWeight: 'bold', fill: '#000000' } }
        },
        yAxis: [
          { max: this.dualAxesNum, min: 0, line: { style: { stroke: '#000000', lineWidth: 2 } }, title: null, label: { style: { fontSize: 18, fontWeight: 'bold', fill: '#000000' } } },
          { max: this.dualAxesNum, min: 0, line: null, label: null }
        ],
        geometryOptions: [
          {
            geometry: 'column',
            label: { position: 'top', style: { fill: 'rgb(96, 146, 246)', fontWeight: 'bold' } }
          },
          {
            geometry: 'line',
            label: { align: 'top', style: { fill: 'purple' } },
            point: { size: 3, style: { fill: 'purple', stroke: 'purple', lineWidth: 2 } },
            color: 'purple',
            lineStyle: { lineWidth: 2, stroke: 'purple' }
          }
        ]
      })
      this.dualAxes.render()
    },
    dualAxesMax (dataList) {
      this.dualAxesNum = 100
      dataList.forEach(res => {
        this.dualAxesNum = res.plan > this.dualAxesNum ? res.plan : this.dualAxesNum
        this.dualAxesNum = res.output > this.dualAxesNum ? res.output : this.dualAxesNum
      })
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
