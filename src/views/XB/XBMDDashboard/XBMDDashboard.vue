<template>
  <div class="xb-md-dashboard-content">
    <div class="content-header">
      <img id="logo" :src="logoPath" alt="#" />
      <div class="title">{{ title }}</div>
      <div class="date-time">
        <div class="date">{{ dateTime.date }}</div>
        <div class="week">{{ dateTime.week }}</div>
        <div class="time">{{ dateTime.time }}</div>
      </div>
    </div>
    <div class="content-body">
      <div class="status-list">
        <div class="status-item" v-for="item in statusList" :key="'status-item-' + item.id">
          <div class="status-item-title-cn">{{ item.ch }}</div>
          <div class="status-item-title-en">{{ item.en }}</div>
          <div v-if="item.id === 1" class="status-item-title-val">{{ item.value }}</div>
          <div v-if="item.id === 2" class="status-item-title-val">{{ item.value }}</div>
          <div v-if="item.id === 3" class="status-item-title-val">{{ item.value | PalletStatusDisc }}</div>
          <div v-if="item.id === 4" class="status-item-title-val">{{ item.value | PalletReverseDisc }}</div>
        </div>
      </div>
      <div class="table-g2-list">
        <div class="g2-inp-out-chart-content">
          <div class="title">{{ inpOutData.title }}</div>
          <div class="description">{{ inpOutData.description }}</div>
          <div id="g2-inp-out-chart"></div>
        </div>
        <div class="table-list">
          <div class="title">{{ inpOutTable.title }}</div>
          <div class="description">{{ inpOutTable.description }}</div>
          <table id="inp-out-table" cell-spacing="0" cell-pendding="0" border="1px">
            <tr>
              <th class="inp-out-table-time-title">时间</th>
              <th class="inp-out-table-time-item" v-for="item in inpOutTable.dataList" :key="'inp-out-table-item-' + item.id">
                <div v-if="item.param">{{ item.param.offsetDay === null ? '休息' : '' }}</div>
                {{ item.time }}
              </th>
            </tr>
            <tr>
              <td class="inp-out-table-inp-title">投入数量</td>
              <td class="inp-out-table-inp-item" v-for="item in inpOutTable.dataList" :key="'inp-out-table-item-' + item.id">
                {{ item.input }}
              </td>
            </tr>
            <tr>
              <td class="inp-out-table-out-title">产出数量</td>
              <td class="inp-out-table-out-item" v-for="item in inpOutTable.dataList" :key="'inp-out-table-item-' + item.id">
                {{ item.output }}
              </td>
            </tr>
            <tr>
              <td class="inp-out-table-percent-title">产出占比</td>
              <td class="inp-out-table-percent-item" v-for="item in inpOutTable.dataList" :key="'inp-out-table-item-' + item.id">
                {{ item.percent }}
              </td>
            </tr>
          </table>
        </div>
        <div class="g2-inp-out-waterfall-content">
          <div class="g2-inp-waterfall-content">
            <div class="title">{{ inpWaterfallData.title }}</div>
            <div class="description">{{ inpWaterfallData.description }}</div>
            <div id="g2-inp-waterfall" />
          </div>
          <div class="g2-out-waterfall-content">
            <div class="title">{{ outWaterfallData.title }}</div>
            <div class="description">{{ outWaterfallData.description }}</div>
            <div id="g2-out-waterfall" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './xb-md-dashboard.css'
import GetReadData from '@/api/readData'
import { Line, Waterfall } from '@antv/g2plot'
import 'ant-design-vue/lib/notification/index'

export default {
  name: 'XBMDDashboard',
  data: () => ({
    // 页面配置
    pageConfig: {},
    /* 定时器 */
    updateTimeInterval: null, // 时间更新 (interval)
    getDataInterval: null, // 获取数据 扫描周期 (interval)
    /* 模拟数据, 时间、增量 存储中心 */
    simObj: {}, // 时间判断、增量存储
    /* 配置信息 */
    title: '', // 标题
    logoPath: null, // 图片(logo) 地址
    dateTime: { date: '', week: '', time: '' }, // 时间 - 日期、星期、时分秒
    /* g2plot 图表 --> 投入产出趋势图、投入数量瀑布表、产出数量瀑布表 */
    renderCanvas: { line: null, inpWaterfall: null, outWaterfall: null },
    /* 岗位信息 { id: 0, name: '', titleCh: '', titleEn: '', contact: '' } */
    statusList: [
      { id: 1, ch: '实际投入总量', en: 'Actual Input', value: 0 },
      { id: 2, ch: '实际产出总量', en: 'Actual Output', value: 0 },
      { id: 3, ch: '产线托盘储备情况', en: 'Line pallet status', value: '-' },
      { id: 4, ch: '产线码垛满料情况', en: 'Line pallets reserve', value: '-' }
    ],
    /* 投入产出趋势图 - 图表(canvas)数据 */
    inpOutData: {
      title: '投入-产出 趋势图',  // 标题
      description: '当日 投入-产出 多折线趋势图',  // 副标题
      dataList: []  // { time: '', timeStr: '', offsetDay: 0, type: 'input / output', typeStr: '投入数量 / 产出数量', value: 0 }
    },
    /* 投入-产出 详情表 - 表格(table) */
    inpOutTable: {
      title: '投入-产出 详情表',  // 标题
      description: '当日各时间段 投入-产出-占比 详细表',  // 副标题
      dataList: []  // { id: 0, param: {}, time: '', input: 0, output: 0, percent: '0%' }
    },
    /* 投入数量 瀑布表 - 图表(canvas)数据 */
    inpWaterfallData: {
      title: '投入数量 瀑布表',  // 标题
      description: '当日各时段 投入数量 详细瀑布表',  // 副标题
      dataList: []  // { id: 0, time: '', value: 0 }
    },
    /* 产出数量 瀑布表 - 图表(canvas)数据 */
    outWaterfallData: {
      title: '产出数量 瀑布表',  // 标题
      description: '当日各时段 产出数量 详细瀑布表',  // 副标题
      dataList: []  // { id: 0, time: '', value: 0 }
    }
  }),
  filters: {
    PalletStatusDisc (disc) {
      switch (disc) {
        case 0: return '空闲 Free'
        case 1: return '正常 Normal'
        case 2: return '满料 Full'
        default: return '未判断 UnKnow'
      }
    },
    PalletReverseDisc (disc) {
      switch (disc) {
        case 0: return '空闲 Free'
        case 1: return '码货中 Stacking'
        case 2: return '满料 Full'
        default: return '未判断 UnKnow'
      }
    }
  },
  created: function () {
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.optional = this.$route.query.optional
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
      this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
    }
  },
  mounted: function () {
    /* 如果 '时间更新' & '获取数据' 定时器正在运行, 消除这些定时器 并 清空缓存 */
    if (this.updateTimeInterval) { window.clearInterval(this.updateTimeInterval); this.updateTimeInterval = null }
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    /* 启动定时器 - 时间更新 & 获取数据 */
    this.UpdateTime()
    this.updateTimeInterval = window.setInterval(this.UpdateTime, 1000)
    this.GetData()
    this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.stack)
  },
  beforeDestroy: function () {
    /* 如果 '时间更新' & '获取数据' 定时器正在运行, 消除这些定时器 并 清空缓存 */
    if (this.updateTimeInterval) { window.clearInterval(this.updateTimeInterval); this.updateTimeInterval = null }
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    /* 清空 g2plot-canvas 容器 */
    document.getElementById('g2-inp-out-chart').innerHTML = ''
    document.getElementById('g2-inp-waterfall').innerHTML = ''
    document.getElementById('g2-out-waterfall').innerHTML = ''
  },
  methods: {
    // 获取数据
    GetData: async function () {
      /* 获取数据 */
      await GetReadData(this.$root.$data.store.devUrl1 + this.$root.$data.store.readDataUrl,
          this.pageConfig.configId,
          this.pageConfig.optional,
          this.pageConfig.produceSize,
          this.pageConfig.protocolNames
      ).then(res => {
        // 处理获取得到的参数
        this.DialogParamData(res['param'])
        this.DialogDataData(res['dataList'])
        this.DialogSimulateData(res['simulateList'])
        this.DialogProtocolNamesData(res['protocolList'])

        // 处理canvas
        this.CreateG2InpOutChart(this.inpOutData.dataList)
        this.CreateG2InpWaterfall(this.inpWaterfallData.dataList)
        this.CreateG2OutWaterfall(this.outWaterfallData.dataList)
      }).catch(err => { console.error(err) })
    },
    // 更新时间
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
    // paramData 处理
    DialogParamData (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))
      // 信息表格
      this.title = paramData.config.title
      this.logoPath = paramData.config.logoPath

      this.inpOutData.dataList = []
      this.inpOutTable.dataList = []
      this.inpWaterfallData.dataList = []
      this.outWaterfallData.dataList = []

      if (paramData.dataList && paramData.dataList instanceof Array && paramData.dataList.length) {
        paramData.dataList.forEach((dataRes, dataIndex) => {
          // 多折线图
          // { time: '', timeStr: '', offsetDay: 0, type: 'input / output', typeStr: '投入数量 / 产出数量', value: 0 }
          const inpOutDataListItem = {
            param: { ...dataRes },
            time: dataRes.timeStr,
            timeStr: dataRes.offsetDay === null ? '休息\n' + dataRes.timeStr : dataRes.timeStr,
            offsetDay: dataRes.offsetDay,
            value: dataRes.offsetDay === null ? null : 0
          }
          this.inpOutData.dataList.push(
              { ...inpOutDataListItem, type: 'input', typeStr: '投入数量'},
              { ...inpOutDataListItem, type: 'output', typeStr: '产出数量' }
          )
          // 表格数据
          // { id: 0, param: {}, time: '', input: 0, output: 0, percent: '0%' }
          this.inpOutTable.dataList.push({
            id: dataIndex + 1,
            param: { ...dataRes },
            time: dataRes.timeStr,
            timeStr: dataRes.offsetDay === null ? '休息\n' + dataRes.timeStr : dataRes.timeStr,
            input: dataRes.offsetDay === null ? null : 0,
            output: dataRes.offsetDay === null ? null : 0,
            percent: dataRes.offsetDay === null ? null : '0%'
          })
          // 投入瀑布图
          // { id: 0, time: '', value: 0 }
          this.inpWaterfallData.dataList.push({
            param: { ...dataRes },
            id: dataIndex + 1,
            time: dataRes.offsetDay === null ? '休息 ' + dataRes.timeStr : dataRes.timeStr,
            value: 0
          })
          // 产出瀑布图
          // { id: 0, time: '', value: 0 }
          this.outWaterfallData.dataList.push({
            param: { ...dataRes },
            id: dataIndex + 1,
            time: dataRes.offsetDay === null ? '休息' + dataRes.timeStr : dataRes.timeStr,
            value: 0
          })
        })
      }
    },
    // data 处理
    DialogDataData (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      /* 可以整合判断, 由于分开判断方便以后排错或修改, 因此分开判断  --  也方便抽离 */
      // 多折线图   { time: '', timeStr: '', offsetDay: 0, type: 'input / output', typeStr: '投入数量 / 产出数量', value: 0 }
      if (this.inpOutData.dataList.length) {
        this.inpOutData.dataList.forEach(inpOutRes => {
          dataData.dataList.forEach(dataRes => {
            if (inpOutRes.param.startTime.timeStamp === dataRes.startTime.timeStamp && inpOutRes.param.endTime.timeStamp === dataRes.endTime.timeStamp) {
              inpOutRes.data = { ...dataRes }
              if (dataRes.productList && dataRes.productList instanceof Array && dataRes.productList.length) {
                let inputNum = 0
                let outputNum = 0
                dataRes.productList.forEach(productRes => {
                  if (productRes.state === 'Input' && productRes.type === 'SmallBox') inputNum += productRes.value
                  if (productRes.state === 'Ok' && productRes.type === 'SmallBox') outputNum += productRes.value
                })
                switch (inpOutRes.type) {
                  case 'input': inpOutRes.value = inputNum; break
                  case 'output': inpOutRes.value = outputNum; break
                  default: break
                }
              }
            }
          })
        })
      }
      // 表格数据   { id: 0, param: {}, time: '', input: 0, output: 0, percent: '0%' }
      if (this.inpOutTable.dataList.length) {
        this.inpOutTable.dataList.forEach(tableRes => {
          dataData.dataList.forEach(dataRes => {
            if (tableRes.param.startTime.timeStamp === dataRes.startTime.timeStamp && tableRes.param.endTime.timeStamp === dataRes.endTime.timeStamp) {
              tableRes.data = { ...dataRes }
              if (dataRes.productList && dataRes.productList instanceof Array && dataRes.productList.length) {
                let inputNum = 0
                let outputNum = 0
                dataRes.productList.forEach(productRes => {
                  if (productRes.state === 'Input' && productRes.type === 'SmallBox') inputNum += productRes.value
                  if (productRes.state === 'Ok' && productRes.type === 'SmallBox') outputNum += productRes.value
                })
                tableRes.input = inputNum
                tableRes.output = outputNum
                if (inputNum === 0 || outputNum === 0) tableRes.percent = 0 + '%'
                else if (inputNum === null || outputNum === null) tableRes.percent = null
                else tableRes.percent = outputNum > inputNum ? 100 + '%' : (outputNum / inputNum).toFixed(1) * 100 + '%'
              }
            }
          })
        })
      }
      // 瀑布图 - inp   { id: 0, time: '', value: 0 }
      if (this.inpWaterfallData.dataList.length) {
        this.inpWaterfallData.dataList.forEach(inpWaterRes => {
          dataData.dataList.forEach(dataRes => {
            if (inpWaterRes.param.startTime.timeStamp === dataRes.startTime.timeStamp && inpWaterRes.param.endTime.timeStamp === dataRes.endTime.timeStamp) {
              inpWaterRes.data = { ...dataRes }
              if (dataRes.productList && dataRes.productList instanceof Array && dataRes.productList.length) {
                let inputNum = 0
                dataRes.productList.forEach(productRes => {
                  if (productRes.state === 'Input' && productRes.type === 'SmallBox') inputNum += productRes.value
                })
                inpWaterRes.value = inputNum
              }
            }
          })
        })
      }
      // 瀑布图 - out   { id: 0, time: '', value: 0 }
      if (this.outWaterfallData.dataList.length) {
        this.outWaterfallData.dataList.forEach(outWaterRes => {
          dataData.dataList.forEach(dataRes => {
            if (outWaterRes.param.startTime.timeStamp === dataRes.startTime.timeStamp && outWaterRes.param.endTime.timeStamp === dataRes.endTime.timeStamp) {
              outWaterRes.data = { ...dataRes }
              if (dataRes.productList && dataRes.productList instanceof Array && dataRes.productList.length) {
                let outputNum = 0
                dataRes.productList.forEach(productRes => {
                  if (productRes.state === 'Ok' && productRes.type === 'SmallBox') outputNum += productRes.value
                })
                outWaterRes.value = outputNum
              }
            }
          })
        })
      }

      // 总数 - 数据来源 dataData.dataList
      if (dataData.dataList.length) {
        let allOutput = 0
        let allInput = 0
        dataData.dataList.forEach(dataRes => {
          if (dataRes.productList && dataRes.productList instanceof Array && dataRes.productList.length) {
            dataRes.productList.forEach(productRes => {
              if (productRes.state === 'Input' && productRes.type === 'SmallBox') allInput += productRes.value
              if (productRes.state === 'Ok' && productRes.type === 'SmallBox') allOutput += productRes.value
            })
          }
        })
        this.statusList[0].value = allInput
        this.statusList[1].value = allOutput
      }
    },
    // simulate 处理
    DialogSimulateData (simulateRes) {
      const simulateData = JSON.parse(JSON.stringify(simulateRes))
      // 当前时间时间戳
      const nowTimeStamp = new Date().valueOf()
      if (this.inpOutTable.dataList && this.inpOutTable.dataList instanceof Array && this.inpOutTable.dataList.length) {
        if (simulateData.dataList && simulateData.dataList instanceof Array && simulateData.dataList.length) {
          // 表格更新
          this.inpOutTable.dataList.forEach(tableRes => {
            simulateData.dataList.forEach(simRes => {
              // 找出 表格上的数据与模拟数据 时间相匹配的所有项
              if (tableRes.param.startTime.timeStamp === simRes.startTime.timeStamp && tableRes.param.endTime.timeStamp === simRes.endTime.timeStamp) {
                if (simRes.productList && simRes.productList instanceof Array && simRes.productList.length) {
                  let inputNum = 0, outputNum = 0
                  simRes.productList.forEach(simProRes => {
                    // 如果 现在时间在模拟时间的某一段时间内 (起始时间 - 现在 - 终点时间)   慢慢模拟
                    if (nowTimeStamp >= simRes.startTime.timeStamp && nowTimeStamp < simRes.endTime.timeStamp) {
                      // 如果已经进入另一个时段 / 时段发生改变
                      if (this.simObj.startTimeStamp !== simRes.startTime.timeStamp || this.simObj.endTimeStamp !== simRes.endTime.timeStamp) {
                        this.simObj.startTimeStamp = simRes.startTime.timeStamp
                        this.simObj.endTimeStamp = simRes.endTime.timeStamp
                        this.simObj.input = {}
                        this.simObj.output = {}
                      }
                      const lastTime = ((simRes.endTime.timeStamp - nowTimeStamp) / this.$root.$data.store.scanTime.simulateTime).toFixed(0) * 1
                      if (simProRes.type === 'SmallBox') {
                        switch (simProRes.status) {
                          case 'Ok': {
                            outputNum = ((simProRes.expected - simProRes.offset - tableRes.output) / lastTime).toFixed(2) * 1
                            this.simObj.output.target = simProRes.expected
                            this.simObj.output.offset = simProRes.offset
                            if (!outputNum || outputNum < 0) outputNum = 0
                            // 模拟增加缓存数
                            if (this.simObj.output.addNum) this.simObj.output.addNum += outputNum
                            else this.simObj.output.addNum = simProRes.offset + tableRes.output + outputNum
                            // 如果已经超过目标值, 停止增加
                            if ((this.simObj.output.addNum + tableRes.output) > simProRes.expected) {
                              this.simObj.output.addNum -= outputNum
                              tableRes.output += this.simObj.output.addNum
                            } else tableRes.output += this.simObj.output.addNum
                            tableRes.output = tableRes.output.toFixed(0) * 1
                            break
                          }
                          case 'Input': {
                            inputNum = ((simProRes.expected - simProRes.offset - tableRes.input) / lastTime).toFixed(2) * 1
                            this.simObj.input.target = simProRes.expected
                            this.simObj.input.offset = simProRes.offset
                            if (!inputNum || inputNum < 0) inputNum = 0
                            // 模拟增加缓存数
                            if (this.simObj.input.addNum) this.simObj.input.addNum += inputNum
                            else this.simObj.input.addNum = simProRes.offset + tableRes.input + inputNum
                            // 如果已经超过目标值, 停止增加
                            if ((this.simObj.input.addNum + tableRes.input) > simProRes.expected) {
                              this.simObj.input.addNum -= inputNum
                              tableRes.input += this.simObj.input.addNum
                            } else tableRes.input += this.simObj.input.addNum
                            tableRes.input = tableRes.input.toFixed(0) * 1
                            break
                          }
                          default: break
                        }
                      }
                      // 如果没有产出, 就没有所谓的完成率
                      if (tableRes.input === 0 || tableRes.output === 0) tableRes.percent = 0 + '%'
                      else if (tableRes.input === null || tableRes.output === null) tableRes.percent = null
                      else tableRes.percent = tableRes.output > tableRes.input ? 100 + '%' : (tableRes.output / tableRes.input).toFixed(1) * 100 + '%'
                    }
                    // 如果 现在时间在模拟时间的时间之后 ( 起始时间 - 终点时间 - 现在 )   如果有该时段的投入产出模拟量, 就设置城模拟量数据显示
                    if (nowTimeStamp > simRes.startTime.timeStamp && nowTimeStamp > simRes.endTime.timeStamp) {
                      if (simProRes.type === 'SmallBox') {
                        switch (simProRes.status) {
                          case 'Ok': outputNum += simProRes.expected; break
                          case 'Input': inputNum += simProRes.expected; break
                          default: break
                        }
                      }
                      tableRes.input = tableRes.input > inputNum ? tableRes.input : inputNum
                      tableRes.output = tableRes.output > outputNum ? tableRes.output : outputNum
                      if (tableRes.input === 0 || tableRes.output === 0) tableRes.percent = 0 + '%'
                      else if (tableRes.input === null || tableRes.output === null) tableRes.percent = null
                      else tableRes.percent = tableRes.output > tableRes.input ? 100 + '%' : (tableRes.output / tableRes.input).toFixed(1) * 100 + '%'
                    }
                    // 如果 现在时间在模拟时间的时间之前 ( 现在 - 起始时间 - 终点时间 )   不做任何操作
                    if (nowTimeStamp < simRes.startTime.timeStamp && nowTimeStamp < simRes.endTime.timeStamp) return false
                  })
                }
              }
            })
          })

          // 图标、信息 更新
          this.inpOutData.dataList = []
          this.inpWaterfallData.dataList = []
          this.outWaterfallData.dataList = []
          this.statusList[0].value = 0
          this.statusList[1].value = 0
          // 使用表格信息做数据源
          this.inpOutTable.dataList.forEach(tableRes => {
            const inpOutDataListItem = {
              param: { ...tableRes.param },
              time: tableRes.timeStr,
              timeStr: tableRes.offsetDay === null ? '休息\n' + tableRes.timeStr : tableRes.timeStr,
              offsetDay: tableRes.offsetDay
            }
            this.inpOutData.dataList.push(
              { ...inpOutDataListItem, type: 'input', typeStr: '投入数量', value: tableRes.input},
              { ...inpOutDataListItem, type: 'output', typeStr: '产出数量', value: tableRes.output }
            )
            this.inpWaterfallData.dataList.push({
              param: { ...tableRes.param },
              time: tableRes.offsetDay === null ? '休息 ' + tableRes.timeStr : tableRes.timeStr,
              value: tableRes.offsetDay === null ? null : tableRes.input
            })
            this.outWaterfallData.dataList.push({
              param: { ...tableRes.param },
              time: tableRes.offsetDay === null ? '休息' + tableRes.timeStr : tableRes.timeStr,
              value: tableRes.offsetDay === null ? null : tableRes.output
            })
            this.statusList[0].value += tableRes.input
            this.statusList[1].value += tableRes.output
          })
        }
      }
    },
    // protocolName 处理
    DialogProtocolNamesData (protocolData) {
      if (protocolData && protocolData instanceof Object && Object.keys(protocolData).length) {
        const protocolNamesArr = Object.keys(protocolData)
        protocolNamesArr.forEach(protocolNamesArrRes => {
          if (protocolNamesArrRes.split('StackPalletStatus').length > 1) this.statusList[2].value = protocolData[protocolNamesArrRes]
          if (protocolNamesArrRes.split('StackPalletsReserve').length > 1) this.statusList[3].value = protocolData[protocolNamesArrRes]
        })
      }
    },
    // 创建 投入-产出 多折线图
    CreateG2InpOutChart (dataList) {
      if (document.getElementById('g2-inp-out-chart').innerHTML === '') {
        this.renderCanvas.line = new Line('g2-inp-out-chart', {
          data: dataList,
          animation: false,
          autoFit: true,
          legend: { position: 'top-right' },
          label: { style: { fontSize: 12, fill: 'rgba(0,0,0,1)' } },
          meta: { timeStr: { alias: '时间' }, value: { alias: '数量' } },
          xField: 'timeStr',
          xAxis: {
            title: { style: { fontSize: 18, fontWeight: 'bold' } },
            line: { style: { stroke: '#cacaca', lineWidth: 2 } },
            label: { style: { fill: 'black', fontWeight: 'bold' } }
          },
          yField: 'value',
          yAxis: {
            title: { style: { fontSize: 18, fontWeight: 'bold' } },
            min: 0,
            line: { style: { stroke: '#cacaca', lineWidth: 2 } },
            label: { style: { fill: 'black', fontWeight: 'bold' } }
          },
          seriesField: 'typeStr'
        })

        this.renderCanvas.line.render()
      }
      else this.renderCanvas.line.changeData(dataList)
    },
    // 创建 投入 瀑布图
    CreateG2InpWaterfall (dataList) {
      if (document.getElementById('g2-inp-waterfall').innerHTML === '') {
        this.renderCanvas.inpWaterfall = new Waterfall('g2-inp-waterfall', {
          data: dataList,
          animation: false,
          autoFit: true,
          xField: 'time',
          yField: 'value',
          legend: { position: 'top-left' },
          label: { style: { fontSize: 12, fill: 'rgba(0,0,0,1)' } },
          xAxis: {
            tickInterval: 1,
            label: {
              formatter: (val) => (val.split('休息').length > 1 ? '休息' : val),
              autoHide: false,
              style: { fill: '#444444', fontSize: 12 }
            }
          },
          meta: { time: { alias: '时间' }, value: { alias: '数量' } },
          total: { label: '总数', style: { fill: 'skyblue' } }
        })
        this.renderCanvas.inpWaterfall.render()
      }
      else this.renderCanvas.inpWaterfall.changeData(dataList)
    },
    // 创建 产出 瀑布图
    CreateG2OutWaterfall (dataList) {
      if (document.getElementById('g2-out-waterfall').innerHTML === '') {
        this.renderCanvas.outWaterfall = new Waterfall('g2-out-waterfall', {
          data: dataList,
          animation: false,
          autoFit: true,
          xField: 'time',
          yField: 'value',
          legend: { position: 'top-left' },
          label: { style: { fontSize: 12, fill: 'rgba(0,0,0,1)' } },
          xAxis: {
            tickInterval: 1,
            label: {
              formatter: (val) => (val.split('休息').length > 1 ? '休息' : val),
              autoHide: false,
              style: { fill: '#444444', fontSize: 12 }
            }
          },
          yAxis: {},
          meta: { time: { alias: '时间' }, value: { alias: '数量' } },
          total: { label: '总数', style: { fill: 'skyblue' } }
        })
        this.renderCanvas.outWaterfall.render()
      }
      else this.renderCanvas.outWaterfall.changeData(dataList)
    },
  }
}
</script>
