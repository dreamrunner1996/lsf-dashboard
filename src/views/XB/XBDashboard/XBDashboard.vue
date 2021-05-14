<template>
  <div class="xb-dashboard-content">
    <div class="content-header">
      <img id="logo" :src="logoPath" alt="#">
      <div class="title">{{ title }}</div>
      <div class="date-time">
        <div class="date">{{ dateTime.date }}</div>
        <div class="week">{{ dateTime.week }}</div>
        <div class="time">{{ dateTime.time }}</div>
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left">
        <div class="table-item">
          <table :cellpadding="0" :cellspacing="0" :border="1">
            <tr v-for="item in staff" :key="'staff-key-' + item.id">
              <td style="width: 233px; font-size: 1.3em; font-weight: bold" class="table-data-key">
                {{ item.titleCh | staffDisplay(item.titleEn) }}
              </td>
              <td style="width: 467px; color: red; font-size: 1.2em; font-weight: bold" colspan="2" class="table-data-name">{{ item.name }}</td>
              <td style="width: 233px; font-size: 1.3em; font-weight: bold" class="table-data-lx">联系方式</td>
              <td style="width: 467px; color: red; font-size: 1.2em; font-weight: bold" colspan="2" class="table-data-phone">{{ item.contact }}</td>
            </tr>
            <tr>
              <td style="width: 233px; font-size: 1.2em">应到人数</td>
              <td style="width: 233px; font-size: 1.2em; color: darkred; font-weight: bold">{{ attendance.num }}</td>
              <td style="width: 234px; font-size: 1.2em">实到人数</td>
              <td style="width: 233px; font-size: 1.2em; color: green; font-weight: bold">{{ attendance.all }}</td>
              <td style="width: 234px; font-size: 1.2em">客户名称</td>
              <td style="width: 233px; font-size: 1.2em; font-weight: bold; color: darkblue">{{ orderCustomer }}</td>
            </tr>
            <tr>
              <td style="width: 233px; font-size: 1.2em">生产订单号</td>
              <td style="width: 233px; font-size: 1.2em; font-weight: bold; color: darkblue">{{ orderCode }}</td>
              <td style="width: 234px; font-size: 1.2em">产品型号</td>
              <td style="width: 233px; font-size: 1.2em; font-weight: bold; color: darkblue">{{ productModel }}</td>
              <td style="width: 233px; font-size: 1.2em">产品规格</td>
              <td style="width: 234px; font-size: 1.2em; font-weight: bold; color: darkblue">{{ productSpec }}</td>
            </tr>
            <tr>
              <td style="width: 233px; font-size: 1.2em">订单数量</td>
              <td style="width: 233px; font-size: 1.2em; font-weight: bold; color: coral">{{ orderNum }}</td>
              <td style="width: 233px; font-size: 1.2em">投入数量</td>
              <td style="width: 233px; font-size: 1.2em; font-weight: bold; color: orangered">{{ inputNum }}</td>
              <td style="width: 233px; font-size: 1.2em">销售目的地</td>
              <td style="width: 234px; font-size: 1.2em; font-weight: bold; color: darkblue">{{ orderDestination }}</td>
            </tr>
          </table>
        </div>
        <div class="table-item">
          <table :cellpadding="0" :cellspacing="0" :border="1">
            <tr>
              <th style="width: 200px; height: 80px; font-size: 1.8em; font-weight: bold">时间段</th>
              <th v-for="(item, index) in tableShowDataList" :key="'time-list-' + index">
                <span v-if="item.offsetDay !== 0 && item.offsetDay !== null"
                      style="color: purple">
                  {{ item.offsetDay | offsetShow }}<br />
                </span>
                <span v-if="item.offsetDay !== null" style="color: mediumpurple; font-size: 1.1em">{{ item.time[0] }}<br />{{ item.time[1] }}</span>
                <span v-else style="color: red;">休息</span>
              </th>
            </tr>
            <tr>
              <td style="font-size: 1.3em; font-weight: bold">目标数量</td>
              <td style="color: dodgerblue; font-size: 1.2em; font-weight: bold" v-for="item in tableShowDataList" :key="'target-' + item.id">
                <span v-if="item.offsetDay !== null">{{ item.target }}</span>
                <!-- {{ item.target }} -->
              </td>
            </tr>
            <tr>
              <td style="font-size: 1.3em; font-weight: bold">投入数量</td>
              <td style="color: coral; font-size: 1.2em; font-weight: bold" v-for="item in tableShowDataList" :key="'input-' + item.id">
                <span v-if="item.offsetDay !== null">{{ item.input }}</span>
                <!-- {{ item.target }} -->
              </td>
            </tr>
            <tr>
              <td style="font-size: 1.3em; font-weight: bold">实际数量</td>
              <td style="color: forestgreen; font-size: 1.2em; font-weight: bold" v-for="item in tableShowDataList" :key="'output-' + item.id">
                <span v-if="item.offsetDay !== null">{{ item.output }}</span>
                <!-- {{ item.output }} -->
              </td>
            </tr>
            <tr>
              <td style="font-size: 1.3em; font-weight: bold">不良数量</td>
              <td style="color: orangered; font-size: 1.2em; font-weight: bold" v-for="item in tableShowDataList" :key="'poor-' + item.id">
                <span v-if="item.offsetDay !== null">{{ item.poor }}</span>
                <!-- {{ item.poor }} -->
              </td>
            </tr>
            <tr>
              <td style="font-size: 1.3em; font-weight: bold">合格率</td>
              <td style="color: deeppink; font-size: 1.2em; font-weight: bold" v-for="item in tableShowDataList" :key="'percent-' + item.id">
                <span v-if="item.offsetDay !== null">{{ item.percent }}</span>
                <!-- {{ item.percent }} -->
              </td>
            </tr>
          </table>
        </div>
        <div class="chart-item">
          <XBDualAxes :title="'生产产量走势'" chart-id="chart-key-1" :chart-data="dualDataList" />
          <XBColumn :title="'生产线每小时完成率'" chart-id="chart-key-2" :chart-data="colDataList" />
        </div>
      </div>

      <div class="content-body-right">
        <div>
          <XBPie :title="'当天计划\n完成比例'" chart-id="chart-key-3" :chart-data="dayFinishPieData" />
        </div>
        <div class="pie-data-item"> <div>计划产量:</div> {{ pieListData.target }} </div>
        <div class="pie-data-item"> <div>完成产量:</div> {{ pieListData.finish }} </div>
        <div class="pie-data-item"> <div>待生产:</div> {{ pieListData.difficult }} </div>
        <div>
          <XBPie :title="'品质状况'" chart-id="chart-key-4" :chart-data="orderFinishPieData" />
        </div>
        <div class="pie-data-item"> <div>合格数量:</div> {{ pieListData.standard }} </div>
        <div class="pie-data-item"> <div>不合格数量:</div> {{ pieListData.disqualified }} </div>
      </div>
    </div>
    <div v-if="simulateMode">Simulate</div>
  </div>
</template>

<script>
import './xb-dashboard.css'
import Axios from 'axios'
import XBDualAxes from '@/components/G2Line/XBDualAxes/XBDualAxes'
import XBColumn from '@/components/G2Line/XBColumn/XBColumn'
import XBPie from '@/components/G2Line/XBPie/XBPie'

const logoImg = require('@/assets/dash-logo.png')

export default {
  name: 'XBDashboard',
  components: { XBDualAxes, XBColumn, XBPie },
  data: () => ({
    flashParam: false,
    mocDataList: [],
    dsSave: [],
    axiosUrl: '',
    dataHidden: [],
    interval: { time: null, data: null },
    dateTime: { date: '', time: '', week: '' },
    simulateMode: false,
    simulateNum: 0,
    simulateNgNum: 0,
    simulateEndTime: 0,
    simulateInterval: null,
    title: 'AF项目部总装车间1线',
    logoPath: logoImg,
    attendance: { all: 0, leave: 0, num: 0 },
    orderCode: '',
    orderCustomer: '',
    orderDestination: '',
    orderNum: '',
    inputNum: 0,
    outputNum: 0,
    productModel: '',
    productName: '',
    productSpec: '',
    staff: [
      { id: 0, name: '', titleCh: '', titleEn: '', contact: '' },
      { id: 1, name: '', titleCh: '', titleEn: '', contact: '' },
      { id: 2, name: '', titleCh: '', titleEn: '', contact: '' },
      { id: 3, name: '', titleCh: '', titleEn: '', contact: '' },
      { id: 4, name: '', titleCh: '', titleEn: '', contact: '' }
    ],
    timeTableDataList: [
        { id: 1, offsetDay: 0, time: ['', ''], input: 0, target: 0, startTime: 0, endTime: 0, output: 0, poor: 0, difficult: 0, percent: '0%' }
    ],
    pieListData: {
      dayFinishTitle: '当天计划完成比例',
      qualityTitle: '品质状况',
      input: 0,
      target: 0,
      finish: 0,
      difficult: 0,
      standard: 0,
      disqualified: 0
    },
    dualDataList: [ { time: '08:00-09:00', output: 0, order: 1 } ],
    colDataList: [ { time: '08:00', value: 0 }, { time: '09:00', value: 0 } ],
    dayFinishPieData: [ { name: '已生产', value: 0 }, { name: '待生产', value: 0 } ],
    orderFinishPieData: [ { name: '合格', value: 0 }, { name: '不合格', value: 0 } ],
    mocTimeTableDataList: [
        { id: 1, offsetDay: 0, time: ['', ''], input: 0, target: 0, startTime: 0, endTime: 0, output: 0, poor: 0, difficult: 0, percent: '0%' }
    ],
    mocTimeTableDialogList: [],
    mocPieListData: {
      dayFinishTitle: '当天计划完成比例',
      qualityTitle: '品质状况',
      input: 0,
      target: 0,
      finish: 0,
      difficult: 0,
      standard: 0,
      disqualified: 0
    },
    mocDualDataList: [ { time: '08:00-09:00', output: 0, order: 1 } ],
    mocColDataList: [ { time: '08:00', value: 0 }, { time: '09:00', value: 0 } ],
    mocDayFinishPieData: [ { name: '已生产', value: 0 }, { name: '待生产', value: 0 } ],
    mocOrderFinishPieData: [ { name: '合格', value: 0 }, { name: '不合格', value: 0 } ]
  }),
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
  computed: {
    tableShowDataList: function () {
      return this.simulateMode ? this.mocTimeTableDataList : this.timeTableDataList
    }
  },
  created () {
    this.axiosUrl = this.$route.query.datasource
  },
  mounted () {
    this.UpdateTime()
    this.GetData()
    this.interval.data = window.setInterval(this.GetData, this.$root.$data.store.scanTime.simulateTime)
    this.interval.time = window.setInterval(this.UpdateTime, 1000)
  },
  beforeDestroy () {
    window.clearInterval(this.interval.time)
    window.clearInterval(this.interval.data)
    this.interval.time = null
    this.interval.data = null
  },
  methods: {
    GetData () {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.displayParam + '?datasource=' + this.axiosUrl).then(res => {
        if (res.data['showDatasource'] === this.axiosUrl) this.DialogDisplayParam(res.data)
        if (res.data && res.data instanceof Array && res.data.length) {
          this.DialogDisplayParam(res.data.find(res1 => {
            return res1.datasource === this.axiosUrl
          }).data)
        }
      }).catch(err => console.error(err)).then(() => {
        Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.product + '?datasource=' + this.axiosUrl).then(res => {
          if (!this.simulateMode && res.data && res.data instanceof Array && res.data.length) {
            this.DialogProduct(res.data.find(res1 => {
              return res1.datasource === this.axiosUrl
            }).data)
          }
        }).catch(err => console.error(err)).then(() => {
          Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.simulate + '?datasource=' + this.axiosUrl).then(res => {
            // default simulate-data
            if (!this.simulateMode) this.SimulateDefault()
            if (res.data && res.data instanceof Array && res.data.length) {
              const dtCheck = res.data.find(mockRes => {
                return mockRes.datasource === this.axiosUrl
              }).data
              if (dtCheck && dtCheck instanceof Array && dtCheck.length) {this.simulateMode = true
                this.DialogMock(res.data.find(mockRes => {
                  return mockRes.datasource === this.axiosUrl
                }).data)
              } else this.simulateMode = false
            } else this.simulateMode = false
          }).catch(err => console.error(err))
        })
      })
    },
    DialogDisplayParam (resData) {
      let getData = JSON.parse(JSON.stringify(resData))
      this.title = getData.title
      this.logoPath = getData.logoPath
      if (getData.staff && getData.staff instanceof Array && getData.staff.length) {
        this.staff = []
        getData.staff.forEach((res, index) => {
          this.staff.push({ id: index, titleEn: res.titleEn, titleCh: res.titleCh, name: res.name, contact: res.contact })
        })
      }
      while (this.staff.length !== 5) {
        if (this.staff.length > 5) this.staff.shift()
        else this.staff.push({ id: this.staff.length, titleEn: '', titleCh: '', name: '', contact: '' })
      }
      this.attendance.all = getData['attendanceAll']
      this.attendance.num = getData.attendanceNum
      this.attendance.leave = getData['attendanceLeave']
      this.orderCode = getData.orderCode
      this.orderCustomer = getData.orderCustomer
      this.orderDestination = getData.orderDestination
      this.orderNum = getData.orderNum
      this.productModel = getData.productModel
      this.productName = getData.productName
      this.productSpec = getData.productSpec
      this.CheckAndSaveParam(getData['dataSlot'])
      if (this.flashParam && getData['dataSlot'] && getData['dataSlot'] instanceof Array && getData['dataSlot'].length) {
        this.timeTableDataList = []
        getData['dataSlot'].forEach((res, index) => {
          res.id = index
          res.startTime = this.TimeToTimeStamp(res.time[0], res.offsetDay)
          res.endTime = this.TimeToTimeStamp(res.time[1], res.offsetDay)
          // 如果正在处于模拟模式, 不更新每次扫描更新的状态
          res.output = 0
          res.input = 0
          res.poor = 0
          res.difficult = 0
          res.percent = '0%'
        })
        this.timeTableDataList = getData['dataSlot']

        this.dualDataList = []
        this.colDataList = []
        let g2TableRest = 0
        getData['dataSlot'].forEach(dtRes => {
          this.dualDataList.push({ time: `${dtRes['time'][0]}-${dtRes['time'][1]}`, output: dtRes['offsetDay'] === null ? null : 0, order: dtRes['offsetDay'] === null ? null : 0 })
          this.colDataList.push({ time: `${dtRes['time'][0]}-${dtRes['time'][1]}`, value: dtRes['offsetDay'] === null ? null : 0 })
          if (dtRes['offsetDay'] === null) {
            this.dualDataList[this.dualDataList.length - 1].time = '休息'
            this.colDataList[this.colDataList.length - 1].time = '休息'
            g2TableRest += 1
            for(let i = 0; i < g2TableRest; i++) {
              this.dualDataList[this.dualDataList.length - 1].time += ' '
              this.colDataList[this.colDataList.length - 1].time += ' '
            }
          }
        })
      }
      getData = null
    },
    DialogProduct (resData) {
      let getData = JSON.parse(JSON.stringify(resData))
      getData.forEach(res => {
        this.timeTableDataList.forEach(res1 => {
          if (res !== null && res1.startTime === res.startTime && res1.endTime === res.endTime) {
            let output = 0
            let poor = 0
            let input = 0
            res['categoryList'].forEach(res2 => {
              switch (res2.status) {
                case 'Input': input += res2.count; break
                case 'Ng': poor += res2.count; break
                default: output += res2.count; break
              }
            })
            res1.input = input
            res1.output = output
            res1.poor = poor
            res1.difficult = (res1.target - output) < 0 ? 0 : res1.target - output
            res1.percent = (output + poor) <= 0 ? '0%' : (output * 100 / (output + poor)).toFixed(0) + '%'
          }
        })
      })
      // 挑出成立的数据列表
      let checkArray = []
      this.timeTableDataList.forEach(res => {
        if (res.offsetDay !== null) {
          getData.forEach(res1 => {
            if (res1 !== null && res.startTime === res1.startTime && res.endTime === res1.endTime) {
              checkArray.push(res)
            }
          })
        } else { checkArray.push(res) }
      })
      if (checkArray && checkArray instanceof Array && checkArray.length) {
        let relaxNum = 0
        this.dualDataList = []
        checkArray.forEach(res => {
          if (res.offsetDay === 0) {
            res.timeString = `${res.time[0]}-${res.time[1]}`
            this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
          } else if (res.offsetDay === 1) {
            res.timeString = `明天 ${res.time[0]}-${res.time[1]}`
            this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
          } else if (res.offsetDay === -1) {
            res.timeString = `昨天 ${res.time[0]}-${res.time[1]}`
            this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
          } else if (res.offsetDay < -1) {
            res.timeString = `前${res.offsetDay * -1}天 ${res.time[0]}-${res.time[1]}`
            this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
          } else if (res.offsetDay > 1) {
            res.timeString = `后${res.offsetDay}天 ${res.time[0]}-${res.time[1]}`
            this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
          } else {
            res.timeString = '休息'
            for (let i = 0; i < relaxNum; i++) {
              res.timeString += ' '
            }
            relaxNum += 1
            this.dualDataList.push({ time: res.timeString, output: 0, order: 0 })
          }
        })
        relaxNum = 0
        this.colDataList = []
        checkArray.forEach(res => {
          if (res.offsetDay !== null) {
            this.colDataList.push({ time: res.timeString, value: (res.output * 100 / res.target).toFixed(0) * 1 })
          } else {
            relaxNum += 1
            this.colDataList.push({ time: res.timeString, value: 0 })
          }
        })

        let inputNum = 0
        let outputNum = 0
        let difficultNum = 0
        let targetNum = 0
        let standardNum = 0
        let disqualifiedNum = 0
        this.dayFinishPieData = []
        checkArray.forEach(res => {
          inputNum += res.input
          outputNum += res.output
          difficultNum += res.difficult
          targetNum += res.target
          standardNum += res.output
          disqualifiedNum += res.poor
        })
        this.pieListData.input = inputNum
        this.pieListData.target = targetNum
        this.pieListData.finish = outputNum
        this.pieListData.difficult = difficultNum
        this.pieListData.standard = standardNum
        this.pieListData.disqualified = disqualifiedNum
        this.dayFinishPieData = [{ name: '已生产', value: outputNum }, { name: '待生产', value: difficultNum }]
        this.orderFinishPieData = [{ name: '合格', value: standardNum }, { name: '不合格', value: disqualifiedNum }]
        outputNum = null
        difficultNum = null
        targetNum = null
        standardNum = null
        disqualifiedNum = null
        relaxNum = null
      }
      checkArray = null

      // 订单投入
      this.inputNum = 0
      this.outputNum = 0
      this.timeTableDataList.forEach(res => {
        console.log(res)
        this.inputNum += res.input
        this.outputNum += res.output
      })

      getData = null
    },
    DialogMock (resData) {
      if (!this.simulateMode) {
        this.mocTimeTableDialogList = []
        return
      }

      let mocChange = false
      let getData = JSON.parse(JSON.stringify(resData))
      this.mocTimeTableDataList = JSON.parse(JSON.stringify(this.timeTableDataList))
      console.warn(getData)
      this.mocTimeTableDataList.forEach(mocDataRes => {
        getData.forEach(mockRes => {
          // if (mocDataRes.offsetDay !== null && mockRes.offsetDay === mocDataRes.offsetDay && mockRes.time[0] === mocDataRes.time[0] && mockRes.time[1] === mocDataRes.time[1]) {
          if (mockRes.time[0] === mocDataRes.time[0] && mockRes.time[1] === mocDataRes.time[1]) {
            // mocDataRes.offset = mockRes.offset
            if (!mocDataRes.mock) mocDataRes.mock = {}
            // mocDataRes.mock.offset = mockRes.offset
            switch (mockRes.status) {
              case 'Ng': {
                mocDataRes.mock.Ng = mockRes.expected < 0 ? 0 : mockRes.expected
                mocDataRes.mock.NgOffset = mockRes.offset < 0 ? 0 : mockRes.offset
                break
              }
              case 'Ok': {
                mocDataRes.mock.Ok = mockRes.expected < 0 ? 0 : mockRes.expected
                mocDataRes.mock.OkOffset = mockRes.offset < 0 ? 0 : mockRes.offset
                break
              }
              case 'Pass': {
                mocDataRes.mock.Pass = mockRes.expected < 0 ? 0 : mockRes.expected
                mocDataRes.mock.PassOffset = mockRes.offset < 0 ? 0 : mockRes.offset
                break
              }
              case 'Input': {
                mocDataRes.mock.Input = mockRes.expected < 0 ? 0 : mockRes.expected
                mocDataRes.mock.InputOffset = mockRes.offset < 0 ? 0 : mockRes.offset
                break
              }
              case 'Repair': {
                mocDataRes.mock.Repair = mockRes.expected < 0 ? 0 : mockRes.expected
                mocDataRes.mock.RepairOffset = mockRes.offset < 0 ? 0 : mockRes.offset
                break
              }
              default: break
            }
          }
        })
      })
      if (this.mocTimeTableDataList.length === this.mocTimeTableDialogList.length) {
        for (let i = this.mocTimeTableDataList.length - 1; i > 0; i--) {
          if (this.mocTimeTableDataList[i].startTime !== this.mocTimeTableDialogList[i].startTime || this.mocTimeTableDataList[i].endTime !== this.mocTimeTableDialogList[i].endTime) mocChange = true
        }
      } else mocChange = true
      // 判断是否出现变化

      mocChange = this.MocDataTargetChange(getData)

      if (mocChange) {
        console.warn('mocChange')

        this.mocTimeTableDialogList = []
        this.mocTimeTableDataList.forEach(mocDataRes => {
          this.mocTimeTableDialogList.push({
            endTime: mocDataRes.endTime,
            startTime: mocDataRes.startTime,
            input: 0,
            output: 0,
            poor: 0,
            inputNotOffset: (mocDataRes['mock'] && mocDataRes['mock'].Input) ? mocDataRes['mock'].Input : 0,
            inputTarget: (mocDataRes['mock'] && mocDataRes['mock'].Input) ? (mocDataRes['mock'].Input - mocDataRes['mock'].InputOffset) < 0 ? 0 : (mocDataRes['mock'].Input - mocDataRes['mock'].InputOffset) : 0,
            outputNotOffset: (mocDataRes['mock'] && mocDataRes['mock'].Ok) ? mocDataRes['mock'].Ok : 0,
            outputTarget: (mocDataRes['mock'] && mocDataRes['mock'].Ok) ? (mocDataRes['mock'].Ok - mocDataRes['mock'].OkOffset) < 0 ? 0 : (mocDataRes['mock'].Ok - mocDataRes['mock'].OkOffset) : 0,
            poorTarget: (mocDataRes['mock'] && mocDataRes['mock'].Ng) ? mocDataRes['mock'].Ng < 0 ? 0 : mocDataRes['mock'].Ng : 0
          })
        })
      }
      // 当前时间
      const nowTime = (new Date()).valueOf()
      console.error(this.mocTimeTableDataList)
      console.log(this.tableShowDataList)
      console.log(this.mocTimeTableDialogList)
      this.tableShowDataList.forEach(showDataRes => {
        this.mocTimeTableDialogList.forEach(mocTimeRes => {
          if (showDataRes.startTime === mocTimeRes.startTime && showDataRes.endTime === mocTimeRes.endTime) {
            if (nowTime < showDataRes.endTime && nowTime > showDataRes.startTime) {
              // 当前时间 -- 非休息时段
              if (showDataRes.offsetDay !== null) {
                const lastTime = ((showDataRes.endTime - nowTime) / 1000).toFixed(0) * 1
                mocTimeRes.output += (mocTimeRes.outputTarget * (this.$root.$data.store.scanTime.simulateTime / 1000) / lastTime)
                mocTimeRes.input= (mocTimeRes.inputTarget * (this.$root.$data.store.scanTime.simulateTime / 1000) / lastTime)
                let outputAdd = mocTimeRes.output.toFixed(0) * 1
                let inputAdd = mocTimeRes.input.toFixed(0) * 1
                if (showDataRes.output > mocTimeRes.outputNotOffset) outputAdd = 0
                if (showDataRes.input > mocTimeRes.inputNotOffset) inputAdd = 0
                showDataRes.output += outputAdd
                showDataRes.input += inputAdd
              }
            } else if (nowTime > showDataRes.endTime) {
              showDataRes.input = showDataRes.input > mocTimeRes.inputNotOffset ? showDataRes.input : mocTimeRes.inputNotOffset
              showDataRes.output = showDataRes.output > mocTimeRes.outputNotOffset ? showDataRes.output : mocTimeRes.outputNotOffset
              // if (showDataRes.output < mocTimeRes.outputNotOffset) showDataRes.output = mocTimeRes.outputNotOffset
              showDataRes.poor = showDataRes.poor < mocTimeRes.poorTarget ? showDataRes.poor : mocTimeRes.poorTarget
              showDataRes.percent = (showDataRes.output + showDataRes.poor) <= 0 ? 0 + '%' : (showDataRes.output * 100 / (showDataRes.output + showDataRes.poor)).toFixed(0) + '%'
            }
          }
        })
      })
      // 挑出成立的数据列表
      this.UpdateMockOther(this.tableShowDataList)
      // console.log(getData)

      // 订单投入
      this.inputNum = 0
      this.tableShowDataList.forEach(res => {
        this.inputNum += res.input
      })

      getData = null
    },
    DialogMockData (resData) {
      if (!this.simulateMode) return
      let getData = JSON.parse(JSON.stringify(resData))
      let mocData = []
      // 如果模拟量长度不正确, 将原来复制一份
      if (this.mocTimeTableDataList.length !== this.timeTableDataList.length) {
        this.mocTimeTableDataList = JSON.parse(JSON.stringify(this.timeTableDataList))
      }
      this.mocTimeTableDataList.forEach(mocListRes => {
        getData.forEach(mockRes => {
          if (mocListRes.offsetDay !== null && mockRes.offsetDay === mocListRes.offsetDay && mockRes.time[0] === mocListRes.time[0] && mockRes.time[1] === mocListRes.time[1]) {
            mocListRes.offset = mockRes.offset
            if (!mocListRes.mock) mocListRes.mock = {}
            mocData.push(mockRes)
            switch (mockRes.status) {
              case 'Ng': { mocListRes.mock.Ng = mockRes.expected < 0 ? 0 : mockRes.expected; break }
              case 'Ok': { mocListRes.mock.Ok = mockRes.expected < 0 ? 0 : mockRes.expected; break }
              case 'Pass': { mocListRes.mock.Pass = mockRes.expected < 0 ? 0 : mockRes.expected; break }
              case 'Input': { mocListRes.mock.Input = mockRes.expected < 0 ? 0 : mockRes.expected; break }
              case 'Repair': { mocListRes.mock.Repair = mockRes.expected < 0 ? 0 : mockRes.expected; break }
              default: break
            }
            mocListRes.mock.offset = mockRes.offset ? mockRes.offset : 0
          }
        })
      })
      this.mocTimeTableDataList.forEach(mocTimeRes => {
        if (mocTimeRes['mock']) {
          mocTimeRes['mock'].output = 0
          if (mocTimeRes['mock'].Ok) mocTimeRes['mock'].output += mocTimeRes['mock'].Ok
          if (mocTimeRes['mock'].Pass) mocTimeRes['mock'].output += mocTimeRes['mock'].Pass
          if (mocTimeRes['mock'].Input) mocTimeRes['mock'].output += mocTimeRes['mock'].Input
          if (mocTimeRes['mock'].Repair) mocTimeRes['mock'].output += mocTimeRes['mock'].Repair
          mocTimeRes.target = mocTimeRes['mock'].output
        }
      })
      if (mocData && mocData instanceof Array && mocData.length) {
        mocData.forEach(mocRes => {
          mocRes.startTime = this.TimeToTimeStamp(mocRes.time[0], mocRes.offsetDay)
          mocRes.endTime = this.TimeToTimeStamp(mocRes.time[1], mocRes.offsetDay)
        })
      }
      // 模拟N日  --  需要删除
      const nowTime = (new Date()).valueOf()
      // 找出当前时间段的显示数据
      let nowTimeTableDataList = this.mocTimeTableDataList.filter(timeTableRes => {
        return (timeTableRes.startTime < nowTime && timeTableRes.endTime > nowTime)
      })
      // 找出当前时段的模拟目标数据
      let nowMocDataList = mocData.filter(mocDataRes => {
        return (mocDataRes.startTime < nowTime && mocDataRes.endTime > nowTime)
      })
      // 如果当前时间已经超过正在模拟的时间段，则清空当前已累加的时间并重新开始进行模拟累加
      if (nowTime > this.simulateEndTime) {
        window.clearInterval(this.simulateInterval)
        this.simulateInterval = null
        this.simulateNum = 0
        this.simulateNgNum = 0
      }
      // 如果当前模拟时间已经不在正在累加的时间断里，更新模拟时间断的结束时间
      if (nowMocDataList.length && nowMocDataList[0].endTime && (this.simulateEndTime !== nowMocDataList[0].endTime)) {
        this.simulateEndTime = nowMocDataList[0].endTime
      }
      if (!this.simulateInterval) {
        if (nowTimeTableDataList && nowTimeTableDataList instanceof Array && nowTimeTableDataList.length && nowTimeTableDataList[0].offsetDay !== null) {
          let nowTimeTableData = nowTimeTableDataList[0]
          let surplusTime = ((nowTimeTableData.endTime - nowTime) / 1000).toFixed(0) * 1
          let targetNum = nowTimeTableData.mock.output ? ((nowTimeTableData.mock.output - nowTimeTableData.output - nowTimeTableData.offset) < 0 ? 0 : nowTimeTableData.mock.output - nowTimeTableData.output - nowTimeTableData.offset) : 0
          let ngNum = nowTimeTableData.mock.Ng ? nowTimeTableData.mock.Ng - nowTimeTableData.poor : 0
          if (!this.simulateInterval) {
            if (targetNum > 0) this.simulateNum += (targetNum / surplusTime).toFixed(2) * (this.$root.$data.store.scanTime.simulateTime / 1000)
            if (ngNum > 0) this.simulateNgNum += (ngNum / surplusTime).toFixed(2) * (this.$root.$data.store.scanTime.simulateTime / 1000)
            this.simulateNgNum += (ngNum / surplusTime).toFixed(2) * (this.$root.$data.store.scanTime.simulateTime / 1000)
            this.simulateInterval = window.setInterval(() => {
              if (targetNum > 0) this.simulateNum += (targetNum / surplusTime).toFixed(2) * (this.$root.$data.store.scanTime.simulateTime / 1000)
              if (ngNum > 0) this.simulateNgNum += (ngNum / surplusTime).toFixed(2) * (this.$root.$data.store.scanTime.simulateTime / 1000)
            }, this.$root.$data.store.scanTime.simulateTime)
          }
          nowTimeTableData = null
        }
      }
      // 如果现阶段存在符合模拟数据, 将模拟数据更新至表中
      if (nowTimeTableDataList && nowTimeTableDataList instanceof Array && nowTimeTableDataList.length && nowTimeTableDataList[0].offsetDay !== null) {
        let nowTimeTableData = nowTimeTableDataList[0]
        nowTimeTableData.output = (this.simulateNum).toFixed(0) * 1
        nowTimeTableData.poor = (this.simulateNgNum).toFixed(0) * 1
        nowTimeTableData.percent = ((nowTimeTableData.output / (nowTimeTableData.output + nowTimeTableData.poor)) * 100).toFixed(2) + '%'
        this.mocTimeTableDataList.forEach(mocTimeRes => {
          if (nowTimeTableData.startTime === mocTimeRes.startTime && nowTimeTableData.endTime === mocTimeRes.endTime) {
            mocTimeRes.output = nowTimeTableData.output === undefined ? 0 : nowTimeTableData.output
            mocTimeRes.poor = nowTimeTableData.poor === undefined ? 0 : nowTimeTableData.poor
            mocTimeRes.percent = nowTimeTableData.percent === undefined ? 0 : nowTimeTableData.percent
          }
        })
        nowTimeTableData = null
      }
      getData = null
      mocData = null
      nowTimeTableDataList = null
      nowMocDataList = null

      // 虚拟图表
      if (this.mocTimeTableDataList && this.mocTimeTableDataList instanceof Array && this.mocTimeTableDataList.length) {
        this.mocDualDataList = []
        this.mocColDataList = []
        let mocTarget = 0, mocFinish = 0, mocDifficult = 0, mocStandard = 0, mocDisqualified = 0, mocInput = 0
        this.mocPieListData = {
          dayFinishTitle: '当天计划完成比例',
          qualityTitle: '品质状况'
        }
        this.mocTimeTableDataList.forEach(mocDataRes => {
          this.mocDualDataList.push({ time: `${mocDataRes.time[0]}-${mocDataRes.time[1]}`, output: mocDataRes.offsetDay === null ? null : mocDataRes.output, order: mocDataRes.offsetDay === null ? null : mocDataRes.target })
          this.mocColDataList.push({ time: `${mocDataRes.time[0]}-${mocDataRes.time[1]}`, value: mocDataRes.offsetDay === null ? 0 : ((mocDataRes.output / mocDataRes.target) * 100).toFixed(2) * 1 })
          mocInput += mocDataRes.input
          mocTarget += mocDataRes.target
          mocFinish += mocDataRes.output
          mocDifficult = (mocTarget - mocFinish) < 0 ? 0 : (mocTarget - mocFinish)
          mocStandard += mocDataRes.output
          mocDisqualified += mocDataRes.poor
        })
        let mocRest = 0
        this.mocDualDataList.forEach(mocDualRes => {
          this.mocColDataList.forEach(mocColRes => {
            if (mocDualRes.order === null && mocDualRes.output === null && mocDualRes.time === mocColRes.time) {
              mocDualRes.time = '休息'
              mocColRes.time = '休息'
              mocColRes.value = null
              for (let mocRestNum = 0; mocRestNum < mocRest; mocRestNum++) {
                mocDualRes.time += ' '
                mocColRes.time += ' '
              }
              mocRest += 1
            }
          })
        })
        this.mocPieListData.input = mocInput
        this.mocPieListData.target = mocTarget
        this.mocPieListData.finish = mocFinish
        this.mocPieListData.difficult = mocDifficult
        this.mocPieListData.standard = mocStandard
        this.mocPieListData.disqualified = mocDisqualified
        this.mocDayFinishPieData = [ { name: '已生产', value: mocFinish }, { name: '待生产', value: mocDifficult } ]
        this.mocOrderFinishPieData = [ { name: '合格', value: mocStandard }, { name: '不合格', value: mocDisqualified } ]
      }
    },
    SimulateDefault () {
      if (this.simulateInterval) window.clearInterval(this.simulateInterval)
      this.simulateInterval = null
      this.simulateNum = 0
      this.simulateNgNum = 0
      this.mocTimeTableDataList = [ { id: 1, offsetDay: 0, time: ['', ''], target: 0, startTime: 0, endTime: 0, output: 0, poor: 0, difficult: 0, percent: '0%' } ]
      this.mocPieListData = {
        dayFinishTitle: '当天计划完成比例',
        qualityTitle: '品质状况',
        target: 0,
        finish: 0,
        difficult: 0,
        standard: 0,
        disqualified: 0
      }
      this.mocDualDataList = [ { time: '08:00-09:00', output: 0, order: 1 } ]
      this.mocColDataList = [ { time: '08:00', value: 0 }, { time: '09:00', value: 0 } ]
      this.mocDayFinishPieData = [ { name: '已生产', value: 0 }, { name: '待生产', value: 0 } ]
      this.mocOrderFinishPieData = [ { name: '合格', value: 0 }, { name: '不合格', value: 0 } ]
    },
    UpdateTime () {
      let date = new Date()
      this.dateTime.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
      this.dateTime.time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
      switch (date.getDay()) {
        case 0: { this.dateTime.week = '周日'; break }
        case 1: { this.dateTime.week = '周一'; break }
        case 2: { this.dateTime.week = '周二'; break }
        case 3: { this.dateTime.week = '周三'; break }
        case 4: { this.dateTime.week = '周四'; break }
        case 5: { this.dateTime.week = '周五'; break }
        case 6: { this.dateTime.week = '周六'; break }
        default: { this.dateTime.week = '-'; break }
      }
      date = null
    },
    TimeToTimeStamp (time, offsetDay) {
      const date = new Date()
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}-`
      const day = date.getDate() - offsetDay
      const hourMinute = `${time}:00`
      return new Date(`${yearMonth}${day} ${hourMinute}`).getTime()
    },
    // 存储每次刷新的配置，如果配置不变，不刷新配置信息 -- 解决闪烁刷新
    CheckAndSaveParam (dataSlot) {
      const dtSlot = JSON.parse(JSON.stringify(dataSlot))
      if (dtSlot && dtSlot instanceof Array && dtSlot.length) {
        // 长度不一致
        if (dtSlot.length !== this.dsSave.length) {
          this.flashParam = true
          this.dsSave = dtSlot
        } else if (dtSlot.length === this.dsSave.length) {
          let paramStatusNum = 0
          for (let i = 0; i < dtSlot.length; i++) {
            // 如果当中有一个不一样，就刷新
            if ((dtSlot[i].offsetDay === this.dsSave[i].offsetDay) && (dtSlot[i].target === this.dsSave[i].target) && (dtSlot[i].time[0] === this.dsSave[i].time[0]) && (dtSlot[i].time[1] === this.dsSave[i].time[1])) {
              paramStatusNum += 1
            } else {
              this.flashParam = true
            }
          }
          if (paramStatusNum === dtSlot.length) {
            this.flashParam = false
          }
        }
      } else {
        this.flashParam = false
      }
    },
    // 刷新除了表格之外的所有数据
    UpdateMockOther (dataList) {
      this.dualDataList = []
      this.colDataList = []
      let relaxNum = 1
      dataList.forEach(res => {
        if (res.offsetDay === 0) {
          res.timeString = `${res.time[0]}-${res.time[1]}`
          this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
        } else if (res.offsetDay === 1) {
          res.timeString = `明天 ${res.time[0]}-${res.time[1]}`
          this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
        } else if (res.offsetDay === -1) {
          res.timeString = `昨天 ${res.time[0]}-${res.time[1]}`
          this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
        } else if (res.offsetDay < -1) {
          res.timeString = `前${res.offsetDay * -1}天 ${res.time[0]}-${res.time[1]}`
          this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
        } else if (res.offsetDay > 1) {
          res.timeString = `后${res.offsetDay}天 ${res.time[0]}-${res.time[1]}`
          this.dualDataList.push({ time: res.timeString, output: res.output, order: res.target })
        } else {
          res.timeString = '休息'
          for (let i = 0; i < relaxNum; i++) {
            res.timeString += ' '
          }
          relaxNum += 1
          this.dualDataList.push({ time: res.timeString, output: 0, order: 0 })
        }
      })
      relaxNum = 0
      this.colDataList = []
      dataList.forEach(res => {
        if (res.offsetDay !== null) {
          this.colDataList.push({ time: res.timeString, value: (res.output * 100 / res.target).toFixed(0) * 1 })
        } else {
          relaxNum += 1
          this.colDataList.push({ time: res.timeString, value: 0 })
        }
      })

      let inputNum = 0
      let outputNum = 0
      let difficultNum = 0
      let targetNum = 0
      let standardNum = 0
      let disqualifiedNum = 0
      this.dayFinishPieData = []
      dataList.forEach(res => {
        inputNum += res.input
        outputNum += res.output
        difficultNum += res.difficult
        targetNum += res.target
        standardNum += res.output
        disqualifiedNum += res.poor
      })
      this.pieListData.input = inputNum
      this.pieListData.target = targetNum
      this.pieListData.finish = outputNum
      this.pieListData.difficult = difficultNum
      this.pieListData.standard = standardNum
      this.pieListData.disqualified = disqualifiedNum
      this.dayFinishPieData = [{ name: '已生产', value: outputNum }, { name: '待生产', value: difficultNum }]
      this.orderFinishPieData = [{ name: '合格', value: standardNum }, { name: '不合格', value: disqualifiedNum }]
      outputNum = null
      difficultNum = null
      targetNum = null
      standardNum = null
      disqualifiedNum = null
      relaxNum = null
    },
    // 检测模拟目标数据是否发生变化
    MocDataTargetChange (dataList) {
      if (this.mocDataList.length === dataList.length) {
        for (let i = 0; i < this.mocDataList.length; i++) {
          // expected offset offsetDay status  time[0, 1]
          // 如果有其中一样修改, 则表示模拟数据目标发生变化
          if ((this.mocDataList[i].expected !== dataList[i].expected) ||
              (this.mocDataList[i].offset !== dataList[i].offset) ||
              (this.mocDataList[i].offsetDay !== dataList[i].offsetDay) ||
              (this.mocDataList[i].status !== dataList[i].status) ||
              (this.mocDataList[i].time[0] !== dataList[i].time[0]) ||
              (this.mocDataList[i].time[1] !== dataList[i].time[1])) {
            this.mocDataList = JSON.parse(JSON.stringify(dataList))
            return true
          }
        }
      } else if (this.mocDataList.length !== dataList.length) {
        this.mocDataList = JSON.parse(JSON.stringify(dataList))
        return true
      }
    }
  }
}
</script>

<style scoped>

</style>
