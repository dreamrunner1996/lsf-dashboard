<template>
  <div class="xin-bao-line-dashboard-content">
    <div class="content-header">
      <div class="logo"><img :src="logoPath" alt="logo" /></div>
      <div class="title">{{ title }}</div>
      <div class="time">
        <div class="time-date">{{ `${dateTime.date}  ${dateTime.week}` }}</div>
        <div class="time-week-time">{{ dateTime.time }}</div>
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left">
        <div class="information-table">
          <table :cellspacing="0" :cellpadding="0" border="1">
            <tr class="information-table-list"
                v-for="staffItem in staffList"
                :key="'staff-item-' + staffItem.id">
              <td class="information-table-item information-staff-item">{{ staffItem.titleCh | staffDisplay(staffItem.titleEn) }}</td>
              <td class="information-table-item information-staff-item" colspan="2">{{ staffItem.name }}</td>
              <td class="information-table-item information-staff-item">联系方式</td>
              <td class="information-table-item information-staff-item" colspan="2">{{ staffItem.contact }}</td>
            </tr>
            <tr class="information-table-list">
              <td class="information-table-item">应到人数</td>
              <td class="information-table-item">{{ informationTable.attendance.all }}</td>
              <td class="information-table-item">实际人数</td>
              <td class="information-table-item">{{ informationTable.attendance.normal }}</td>
              <td class="information-table-item">客户名称</td>
              <td class="information-table-item">{{ informationTable.orderCustomer }}</td>
            </tr>
            <tr class="information-table-list">
              <td class="information-table-item">生产订单号</td>
              <td class="information-table-item">{{ informationTable.orderCode }}</td>
              <td class="information-table-item">产品型号</td>
              <td class="information-table-item">{{ informationTable.productModel }}</td>
              <td class="information-table-item">产品规格</td>
              <td class="information-table-item">{{ informationTable.productSpec }}</td>
            </tr>
            <tr class="information-table-list">
              <td class="information-table-item">订单数量</td>
              <td class="information-table-item">{{ informationTable.orderNum }}</td>
              <td class="information-table-item">投入数量</td>
              <td class="information-table-item">{{ informationTable.inputNum }}</td>
              <td class="information-table-item">销售目的地</td>
              <td class="information-table-item">{{ informationTable.orderDestination }}</td>
            </tr>
          </table>
        </div>
        <div class="inp-out-table">
          <!--     { id, offsetDay, timeStr, target, input, output, useless, percent }     -->
          <table :cellspacing="0" :cellpadding="0" border="1">
            <tr class="inp-out-table-timer-list">
              <th class="inp-out-table-timer-title">时间段</th>
              <th class="inp-out-table-timer-item"
                  v-for="inpOutTableTimerItem in productTable"
                  :style="inpOutTableTimerItem.offsetDay === null ? { width: '100px' } : {}"
                  :key="'inp-out-table-timer-item-' + inpOutTableTimerItem.id">
                <span v-if="inpOutTableTimerItem.offsetDay === null">休息</span>
                <span v-else>{{ inpOutTableTimerItem.timeStr }}</span>
              </th>
            </tr>
            <tr class="inp-out-table-target-list">
              <td class="inp-out-table-target-title">目标数量</td>
              <td class="inp-out-table-target-item"
                  v-for="inpOutTableTargetItem in productTable"
                  :key="'inp-out-table-target-item-' + inpOutTableTargetItem.id">
                {{ inpOutTableTargetItem.offsetDay === null ? null : inpOutTableTargetItem.target }}
              </td>
            </tr>
            <tr class="inp-out-table-input-list">
              <td class="inp-out-table-input-title">投入数量</td>
              <td class="inp-out-table-input-item"
                  v-for="inpOutTableInputItem in productTable"
                  :key="'inp-out-table-input-item-' + inpOutTableInputItem.id">
                {{ inpOutTableInputItem.offsetDay === null ? null : inpOutTableInputItem.input }}
              </td>
            </tr>
            <tr class="inp-out-table-output-list">
              <td class="inp-out-table-output-title">实际数量</td>
<!--              :style="{color: inpOutTableOutputItem.output <= 0 ? 'red' : 'darkblue'}"-->
              <td class="inp-out-table-output-item"
                  v-for="inpOutTableOutputItem in productTable"
                  style="color: #FFFFFF"
                  :key="'inp-out-table-output-item-' + inpOutTableOutputItem.id">
                {{ inpOutTableOutputItem.offsetDay === null ? null : inpOutTableOutputItem.output }}
              </td>
            </tr>
            <tr class="inp-out-table-useless-list">
              <td class="inp-out-table-useless-title">不良数量</td>
<!--              :style="{color: inpOutTableUselessItem.useless ? 'red' : 'black'}"-->
              <td class="inp-out-table-useless-item"
                  style="color: #FFFFFF"
                  v-for="inpOutTableUselessItem in productTable"
                  :key="'inp-out-table-useless-item-' + inpOutTableUselessItem.id">
                {{ inpOutTableUselessItem.offsetDay === null ? null : inpOutTableUselessItem.useless }}
              </td>
            </tr>
            <tr class="inp-out-table-percent-list">
              <td class="inp-out-table-percent-title">合格率</td>
<!--              :style="{color: inpOutTablePercentItem.percent <= 0 ? 'red' : 'darkblue'}"-->
              <td class="inp-out-table-percent-item"
                  style="color: #FFFFFF"
                  v-for="inpOutTablePercentItem in productTable"
                  :key="'inp-out-table-percent-item-' + inpOutTablePercentItem.id">
                {{ inpOutTablePercentItem.offsetDay === null ? null : inpOutTablePercentItem.percent + '%' }}
              </td>
            </tr>
          </table>
        </div>
        <div class="g2-output-finish-canvas-content">
          <div class="g2-output-canvas-content">
            <div class="g2-output-canvas-title">{{ outputLine.title }}</div>
            <div class="g2-output-canvas-description">{{ outputLine.description }}</div>
            <div class="g2-output-canvas-canvas" id="g2-output-canvas-canvas" />
          </div>
          <div class="g2-finish-canvas-content">
            <div class="g2-finish-canvas-title">{{ finishColumn.title }}</div>
            <div class="g2-finish-canvas-description">{{ finishColumn.description }}</div>
            <div class="g2-finish-canvas-canvas" id="g2-finish-canvas-canvas" />
          </div>
        </div>
      </div>
      <div class="content-body-right">
        <div class="g2-plan-pie-canvas-content">
          <div class="g2-plan-pie-canvas-title">{{ planPie.title }}</div>
          <div class="g2-plan-pie-canvas-description">{{ planPie.description }}</div>
          <div class="g2-plan-pie-canvas-canvas" id="g2-plan-pie-canvas-canvas" />
        </div>
        <div class="product-information-content">
          <div class="product-information-item">
            <div class="product-information-title">计划产量</div>
            <div class="product-information-value">{{ productInformation.plan }}</div>
          </div>
          <div class="product-information-item">
            <div class="product-information-title">完成产量</div>
            <div class="product-information-value">{{ productInformation.finish }}</div>
          </div>
          <div class="product-information-item">
            <div class="product-information-title">待生产</div>
            <div class="product-information-value">{{ productInformation.unFinish }}</div>
          </div>
        </div>
        <div class="g2-quality-pie-canvas-content">
          <div class="g2-quality-pie-canvas-title">{{ qualityPie.title }}</div>
          <div class="g2-quality-pie-canvas-description">{{ qualityPie.description }}</div>
          <div class="g2-quality-pie-canvas-canvas" id="g2-quality-pie-canvas-canvas" />
        </div>
        <div class="product-information-content">
          <div class="product-information-item">
            <div class="product-information-title">合格数量</div>
            <div class="product-information-value">{{ productInformation.qualification }}</div>
          </div>
          <div class="product-information-item">
            <div class="product-information-title">不合格数量</div>
            <div class="product-information-value">{{ productInformation.unQualification }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './XinBaoLineDashboard.css'
import GetReadData from '@/api/readData'
import { DualAxes, Column, Pie } from '@antv/g2plot'

export default {
  name: 'XinBaoLineDashboard',
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
    /* g2plot 图表 --> 产能走势折线图、完成率柱状图、当天计划完成比例饼图、品质状况饼图 */
    renderCanvas: { outputLine: null, finishColumn: null, planPie: null, qualityPie: null },
    /* 信息表格 - 详细参数 */
    informationTable: {
      staff: [], // 岗位信息 { id: 0, name: '', titleCh: '', titleEn: '', contact: '' }
      attendance: { all: 0, normal: 0, leave: 0, absence: 0 }, // 考勤信息 - 应到、出勤、请假、缺席
      orderCode: null, // 订单号
      orderCustomer: null, // 订单客户
      orderDestination: null, // 订单目的地
      orderNum: 0, // 订单数量
      inputNum: 0, // 投入数量
      productModel: null, // 产品机型
      productName: null, // 产品名称
      productSpec: null, // 产品规格
      dataHidden: [] // 隐藏信息 - PS: 内容为 informationTable 中的字段, 出现则令该字段数值进行遮挡
    },
    /* 计划、完成、待生产、合格、不合格 数据 - 详细数据 */
    productInformation: {}, // { plan, finish, unFinish, qualification, unQualification }
    /* 产能表格 */
    productTable: [], // { id, offsetDay, timeStr, target, input, output, useless, percent }
    /* 产能走势折线图 - 图表(canvas)数据 */
    outputLine: {
      title: '产能走势趋势', // 标题
      description: '各时段生产产能走势折线图', // 副标题
      data: [] // { offsetDay, timeStr, target, value }
    },
    /* 完成率柱状图 - 图表(canvas)数据 */
    finishColumn: {
      title: '产能完成率详情', // 标题
      description: '各时段生产产能完成率柱状图', // 副标题
      data: [] // { offsetDay, timeStr, value }
    },
    /* 当天计划完成比例饼图 - 图表(canvas)数据 */
    planPie: {
      title: '计划完成比例', // 标题
      description: '当天计划完成比例饼图', // 副标题
      data: {} // { plan, finishVal, unFinishVal },
    },
    /* 品质状况饼图 - 图表(canvas)数据 */
    qualityPie: {
      title: '品质状况', // 标题
      description: '当天产能品质状况饼图', // 副标题,
      data: {} // { all, qualificationVal, unQualificationVal }
    }
  }),
  computed: {
    // 确保职工列表维持5行, 如果少于5行则留空后面, 如果超出5行则切断后面
    staffList: function () {
      let staffArray = JSON.parse(JSON.stringify(this.informationTable.staff))
      if (staffArray.length <= 5) {
        for (let i = 5 - staffArray.length; i > 0; i--) {
          staffArray.push({ id: staffArray.length + 1, name: '', titleCh: '', titleEn: '', contact: '' })
        }
      } else {
        for (let i = staffArray.length; i > 5; i--) { staffArray.pop() }
      }
      return staffArray
    }
  },
  filters: {
    // 职位信息 - 中英文显示情况  中英文全齐: 中(英), 仅中文/仅英文: 中/英
    staffDisplay: function (ch, en) {
      if (ch && en) return `${ch}(${en})`
      else if (ch) return ch
      else if (en) return en
      else return '-'
    }
  },
  created: function () {
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
    }
    console.error(this.pageConfig)
  },
  mounted: function () {
    /* 如果 '时间更新' & '获取数据' 定时器正在运行, 消除这些定时器 并 清空缓存 */
    if (this.updateTimeInterval) { window.clearInterval(this.updateTimeInterval); this.updateTimeInterval = null }
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    /* 启动定时器 - 时间更新 & 获取数据 */
    this.UpdateTime()
    this.updateTimeInterval = window.setInterval(this.UpdateTime, 1000)
    this.GetData()
    this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.table)
  },
  beforeDestroy: function () {
    /* 如果 '时间更新' & '获取数据' 定时器正在运行, 消除这些定时器 并 清空缓存 */
    if (this.updateTimeInterval) { window.clearInterval(this.updateTimeInterval); this.updateTimeInterval = null }
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    /* 清空 g2plot-canvas 容器 */
    document.getElementById('g2-output-canvas-canvas').innerHTML = ''
    document.getElementById('g2-finish-canvas-canvas').innerHTML = ''
    document.getElementById('g2-plan-pie-canvas-canvas').innerHTML = ''
    document.getElementById('g2-quality-pie-canvas-canvas').innerHTML = ''
  },
  methods: {
    // 获取数据 - 使用 async await 进行异步数据获取处理
    GetData: async function () {
      /* 获取 数据 */
      await GetReadData(this.$root.$data.store.devUrl + this.$root.$data.store.readDataUrl,
          this.pageConfig.configId,
          this.pageConfig.protocolNames
      ).then(res => {
        // 处理获取得到的参数
        this.DialogParamData(res['param'])
        this.DialogDataData(res['dataList'])
        this.DialogSimulateData(res['simulateList'])

        // 处理canvas
        this.CreateUpdateG2OutputLine(this.outputLine.data)
        this.CreateUpdateG2FinishColumn(this.finishColumn.data)
        this.CreateUpdateG2PlanPie(this.planPie.data)
        this.CreateUpdateG2QualityPie(this.qualityPie.data)
      }).catch(err => { console.error(err) })
    },
    // 处理 页面参数配置数据
    DialogParamData: function (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))
      // 信息表格
      this.title = paramData.config.title
      this.logoPath = paramData.config.logoPath
      this.informationTable.attendance = { ...paramData.attendance }
      this.informationTable.staff = paramData.staffList
      this.informationTable = { ...this.informationTable, ...paramData.information }

      // 隐藏客户信息
      if (this.informationTable.dataHidden.length) {
        this.informationTable.dataHidden.forEach(hiddenRes => {
          if (this.informationTable[hiddenRes]) { this.informationTable[hiddenRes] = '-' }
        })
      }
      this.productTable = []
      this.outputLine.data = []
      this.outputLine.data = []
      this.finishColumn.data = []
      let allTargetNum = 0
      paramData.dataList.forEach(productDataRes => {
        // 产能表格
        this.productTable.push({ ...productDataRes, input: 0, output: 0, useless: 0, percent: 0 })
        // 产能走势折线图
        this.outputLine.data.push({ ...productDataRes, offsetDay: productDataRes.offsetDay, timeStr: productDataRes.timeStr, target: productDataRes.target, value: 0 })
        // 完成率柱状图
        this.finishColumn.data.push({ ...productDataRes, offsetDay: productDataRes.offsetDay, timeStr: productDataRes.timeStr, value: 0 })
        // 当天计划完成比例饼图
        allTargetNum += productDataRes.target
      })
      this.planPie.data = { plan: allTargetNum, finishVal: 0, unFinishVal: 0 }
      this.qualityPie.data = { all: 0, qualificationVal: 0, unQualificationVal: 0 }
      this.productInformation = { plan: allTargetNum, finish: 0, unFinish: 0, qualification: 0, unQualification: 0 }
    },
    // 处理 产能数据信息数据
    DialogDataData: function (dialogRes) {
      const dialogData = JSON.parse(JSON.stringify(dialogRes))

      console.warn(this.productTable)
      console.warn(dialogRes['dataList'])

      /* 可以整合判断, 由于分开判断方便以后排错或修改, 因此分开判断  --  也方便抽离 */
      // 产能表格数据 - 必须对的上    ---   { id, offsetDay, timeStr, target, input, output, useless, percent }
      if (this.productTable.length) {
        this.productTable.forEach(productTableRes => {
          dialogData.dataList.forEach(dialogDataRes => {
            if (productTableRes.startTime.timeStamp === dialogDataRes.startTime.timeStamp && productTableRes.endTime.timeStamp === dialogDataRes.endTime.timeStamp) {
              productTableRes.data = { ...dialogDataRes }
              if (dialogDataRes.productList && dialogDataRes.productList instanceof Array && dialogDataRes.productList.length) {
                let inputNum = 0, outputNum = 0, uselessNum = 0
                dialogDataRes.productList.forEach(productRes => {
                  switch (productRes.state) {
                    case 'Ok': outputNum += productRes.value; break
                    case 'Input': inputNum += productRes.value; break
                    case 'Ng': uselessNum += productRes.value; break
                    default: break
                  }
                })
                productTableRes.input = inputNum
                productTableRes.output = outputNum
                productTableRes.useless = uselessNum
                productTableRes.percent = (outputNum + uselessNum) <= 0 ? 0 : (outputNum * 100 / (outputNum + uselessNum)).toFixed(0)
              }
            }
          })
        })
      }
      // 产能走势折线图 - 图表(canvas)数据   ---  { startTime, endTime, offsetDay, timeStr, target, value }
      if (this.outputLine.data.length) {
        this.outputLine.data.forEach(outputLineRes => {
          dialogData.dataList.forEach(dialogDataRes => {
            if (outputLineRes.startTime.timeStamp === dialogDataRes.startTime.timeStamp && outputLineRes.endTime.timeStamp === dialogDataRes.endTime.timeStamp) {
              let outputNum = 0
              dialogDataRes.productList.forEach(productRes => {
                if (productRes.state === 'Ok') outputNum += productRes.value
              })
              outputLineRes.value = outputNum
            }
          })
        })
      }
      // 完成率柱状图 - 图表(canvas)数据   ---   { startTime, endTime, offsetDay, timeStr, value }
      if (this.finishColumn.data.length) {
        this.finishColumn.data.forEach(finishColumnRes => {
          dialogData.dataList.forEach(dialogDataRes => {
            // 时间戳对照, 如果时间对不上就不进行操作, 如果时间正确就进行计算
            if (finishColumnRes.startTime.timeStamp === dialogDataRes.startTime.timeStamp && finishColumnRes.endTime.timeStamp === dialogDataRes.endTime.timeStamp) {
              let outputNum = 0, targetNum = 0
              dialogDataRes.productList.forEach(productRes => {
                if (productRes.state === 'Ok') outputNum += productRes.value
              })
              if (targetNum === 0 || outputNum === 0) finishColumnRes.value = 0
              else if (targetNum < outputNum) finishColumnRes.value = 100
              else finishColumnRes.value = ((outputNum / targetNum) * 100).toFixed(1) * 1
            }
          })
        })
      }
      // 当天计划完成比例饼图 - 图表(canvas)数据   ---   数据获取表格数据进行更新 { plan, finishVal, unFinishVal }
      if (this.productTable.length) {
        let plan = 0, finishVal = 0, unFinishVal
        this.productTable.forEach(productTableRes => {
          plan += productTableRes.target
          finishVal += productTableRes.output
        })
        unFinishVal = finishVal > plan ? 0 : plan - finishVal
        this.planPie.data = { plan, finishVal, unFinishVal }
      }
      // 品质状况饼图 - 图表(canvas)数据   ---   数据获取表格数据进行更新 { all, qualificationVal, unQualificationVal }
      if (this.productTable.length) {
        let qualificationVal = 0, unQualificationVal = 0
        this.productTable.forEach(productTableRes => {
          qualificationVal += productTableRes.output
          unQualificationVal += productTableRes.useless
        })
        this.qualityPie.data = { all: qualificationVal + unQualificationVal, qualificationVal, unQualificationVal }
      }
      // 计划、完成、待生产、合格、不合格 数据 - 详细数据更新  ---  { plan: allTargetNum, finish: 0, unFinish: 0, qualification: 0, unQualification: 0 }
      if (this.productTable.length) {
        let plan = 0, finishVal = 0, unFinishVal, qualificationVal = 0, unQualificationVal = 0
        this.productTable.forEach(productTableRes => {
          plan += productTableRes.target
          finishVal += productTableRes.output
          qualificationVal += productTableRes.output
          unQualificationVal += productTableRes.useless
        })
        unFinishVal = finishVal > plan ? 0 : plan - finishVal
        // 强制刷新
        this.$set(this.productInformation, 'plan', plan)
        this.$set(this.productInformation, 'finish', finishVal)
        this.$set(this.productInformation, 'unFinish', unFinishVal)
        this.$set(this.productInformation, 'qualification', qualificationVal)
        this.$set(this.productInformation, 'unQualification', unQualificationVal)
      }
    },
    // 处理 模拟数据参数数据
    DialogSimulateData: function (simulateRes) {
      const simulateData = JSON.parse(JSON.stringify(simulateRes))
      // 当前时间时间戳
      const nowTimeStamp = new Date().valueOf()
      if (this.productTable.length) {
        if (simulateData.dataList && simulateData.dataList instanceof Array && simulateData.dataList.length) {
          // 表格更新
          this.productTable.forEach(productTableRes => {
            simulateData.dataList.forEach(simRes => {
              // 找出 表格上的数据与模拟数据 时间相匹配的所有项
              if (productTableRes.startTime.timeStamp === simRes.startTime.timeStamp && productTableRes.endTime.timeStamp === simRes.endTime.timeStamp) {
                if (simRes.productList && simRes.productList instanceof Array && simRes.productList.length) {
                  let inputNum = 0, outputNum = 0, uselessNum = 0
                  simRes.productList.forEach(simProRes => {
                    // 如果 现在时间再模拟时间的某一段时间以内 (起始时间 - 现在 - 终点时间)   慢慢模拟
                    if (nowTimeStamp >= simRes.startTime.timeStamp && nowTimeStamp <= simRes.endTime.timeStamp) {
                      // 如果已经进入另一个时段 / 时段发生改变
                      if (this.simObj.startTimeStamp !== simRes.startTime.timeStamp || this.simObj.endTimeStamp !== simRes.endTime.timeStamp) {
                        this.simObj.startTimeStamp = simRes.startTime.timeStamp
                        this.simObj.endTimeStamp = simRes.endTime.timeStamp
                        this.simObj.input = {}
                        this.simObj.output = {}
                        this.simObj.useless = {}
                      }
                      const lastTime = ((simRes.endTime.timeStamp - nowTimeStamp) / this.$root.$data.store.scanTime.simulateTime).toFixed(0) * 1
                      switch (simProRes.status) {
                        case 'Ok': {
                          outputNum = ((simProRes.expected - simProRes.offset - productTableRes.output) / lastTime).toFixed(2) * 1
                          this.simObj.output.target = simProRes.expected
                          this.simObj.output.offset = simProRes.offset
                          if (!outputNum || outputNum < 0) outputNum = 0
                          // 模拟增加缓存数
                          if (this.simObj.output.addNum) this.simObj.output.addNum += outputNum
                          else this.simObj.output.addNum = simProRes.offset + productTableRes.output + outputNum
                          // 如果已经超过目标值, 停止增加
                          if ((this.simObj.output.addNum + productTableRes.output) > simProRes.expected) {
                            this.simObj.output.addNum -= outputNum
                            productTableRes.output += this.simObj.output.addNum
                          } else productTableRes.output += this.simObj.output.addNum
                          productTableRes.output = productTableRes.output.toFixed(0) * 1
                          break
                        }
                        case 'Input': {
                          inputNum = ((simProRes.expected - simProRes.offset - productTableRes.input) / lastTime).toFixed(2) * 1
                          this.simObj.input.target = simProRes.expected
                          this.simObj.input.offset = simProRes.offset
                          if (!inputNum || inputNum < 0) inputNum = 0
                          // 模拟增加缓存数
                          if (this.simObj.input.addNum) this.simObj.input.addNum += inputNum
                          else this.simObj.input.addNum = simProRes.offset + productTableRes.input + inputNum
                          // 如果已经超过目标值, 停止增加
                          if ((this.simObj.input.addNum + productTableRes.input) > simProRes.expected) {
                            this.simObj.input.addNum -= inputNum
                            productTableRes.input += this.simObj.input.addNum
                          } else productTableRes.input += this.simObj.input.addNum
                          productTableRes.input = productTableRes.input.toFixed(0) * 1
                          break
                        }
                        case 'Ng': {
                          uselessNum = ((simProRes.expected - simProRes.offset - productTableRes.useless) / lastTime).toFixed(2) * 1
                          this.simObj.useless.target = simProRes.expected
                          this.simObj.useless.offset = simProRes.offset
                          if (!uselessNum || uselessNum < 0) uselessNum = 0
                          // 模拟增加缓存数
                          if (this.simObj.useless.addNum) this.simObj.useless.addNum += uselessNum
                          else this.simObj.useless.addNum = simProRes.offset + productTableRes.useless + uselessNum
                          // 如果已经超过目标值, 停止增加
                          if ((this.simObj.useless.addNum + productTableRes.useless) > simProRes.expected) {
                            this.simObj.useless.addNum -= uselessNum
                            productTableRes.useless += this.simObj.useless.addNum
                          } else productTableRes.useless += this.simObj.useless.addNum
                          productTableRes.useless = productTableRes.useless.toFixed(0) * 1
                          break
                        }
                        default: break
                      }
                      // 如果没有产出, 就没有所谓的合格率
                      if (productTableRes.output === 0) productTableRes.percent = 0
                      else productTableRes.percent = productTableRes.output > (productTableRes.useless + productTableRes.output) ? 100 : (productTableRes.output / (productTableRes.useless + productTableRes.output)).toFixed(2) * 100
                    }
                    // 如果 现在时间在模拟时间的时间之后 ( 起始时间 - 终点时间 - 现在 )   如果有该时段的投入产出模拟量, 就设置城模拟量数据显示
                    if (nowTimeStamp > simRes.startTime.timeStamp && nowTimeStamp > simRes.endTime.timeStamp) {
                      switch (simProRes.status) {
                        case 'Ok': outputNum += simProRes.expected; break
                        case 'Input': inputNum += simProRes.expected; break
                        case 'Ng': uselessNum += simProRes.expected; break
                        default: break
                      }
                      productTableRes.input = productTableRes.input > inputNum ? productTableRes.input : inputNum
                      productTableRes.output = productTableRes.output > outputNum ? productTableRes.output : outputNum
                      productTableRes.useless = productTableRes.useless > uselessNum ? productTableRes.useless : uselessNum
                      if (productTableRes.output === 0) productTableRes.percent = 0
                      else productTableRes.percent = productTableRes.output > (productTableRes.useless + productTableRes.output) ? 100 : (productTableRes.output / (productTableRes.useless + productTableRes.output)).toFixed(2) * 100
                    }
                    // 如果 现在时间在模拟时间的时间之前 ( 现在 - 起始时间 - 终点时间 )   不做任何操作
                    if (nowTimeStamp < simRes.startTime.timeStamp && nowTimeStamp < simRes.endTime.timeStamp) return false
                  })
                }
              }
            })
          })
          // 图表、信息栏 更新
          let planNum = 0, finishNum = 0, unFinishNum = 0, qualificationNum = 0, unQualificationNum = 0
          this.outputLine.data = []
          this.finishColumn.data = []
          this.planPie.data = {}
          this.qualityPie.data = {}
          this.productInformation = {}
          // 使用表格信息做数据源
          this.productTable.forEach(productTableRes => {
            this.outputLine.data.push({
              offsetDay: productTableRes.offsetDay,
              timeStr: productTableRes.timeStr,
              target: productTableRes.target,
              value: productTableRes.output
            })
            // 百分比
            let finishValue
            if (productTableRes.target === 0 || productTableRes.output === 0) finishValue = 0
            else if (productTableRes.target <  productTableRes.output) finishValue = 100
            else finishValue = ((productTableRes.output / productTableRes.target) * 100).toFixed(1) * 1
            this.finishColumn.data.push({
              offsetDay: productTableRes.offsetDay,
              timeStr: productTableRes.timeStr,
              value: finishValue
            })
            planNum += productTableRes.target
            finishNum += productTableRes.output
            unFinishNum = planNum < finishNum ? 0 : (planNum - finishNum)
            qualificationNum += productTableRes.output
            unQualificationNum += productTableRes.useless
          })
          this.planPie.data = { plan: planNum, finishVal: finishNum, unFinishVal: unFinishNum }
          this.qualityPie.data = { all: qualificationNum + unQualificationNum, qualificationVal: qualificationNum, unQualificationVal: unQualificationNum }
          this.productInformation = {
            plan: planNum,
            finish: finishNum,
            unFinish: unFinishNum,
            qualification: qualificationNum,
            unQualification: 0
          }
          this.$set(this.productInformation, 'unQualification', unQualificationNum)
        }
      }
    },
    // 创建/更新 产能走势折线图
    CreateUpdateG2OutputLine: function (dataList) {
      const outputLineData = JSON.parse(JSON.stringify(dataList))
      const _this = this
      // 获取Y轴最大值, 更新 timeStr 字段 (休息时段添加休息 -> offset === null)
      let yMax = 100
      outputLineData.forEach(outputLineDataRes => {
        if (outputLineDataRes.offsetDay === null) outputLineDataRes.timeStr = '休息 ' + outputLineDataRes.timeStr
        yMax = outputLineDataRes.value > yMax ? outputLineDataRes.value : yMax
        yMax = outputLineDataRes.target > yMax ? outputLineDataRes.target : yMax
      })
      // 如果原本已有数据，就删除图标重新制作。如果原本没有数据，就创建canvas  ---  因为直接更新数据无法正常显示，因此就重制图表
      function CreateCanvas () {
        _this.renderCanvas.outputLine = new DualAxes('g2-output-canvas-canvas', {
          data: [outputLineData, outputLineData],
          animation: false,
          autoFit: true,
          xField: 'timeStr',
          yField: ['value', 'target'],
          padding: [20, 20, 45, 50],
          geometryOptions: [
            { geometry: 'column', color: 'yellow', label: { position: 'middle', style: { fill: "black", fontWeight: 'bold' } } },
            { geometry: 'line', label: { align: 'top', style: { fill: 'orangered' } },
              point: { size: 3, style: { fill: 'orangered', stroke: 'orangered', lineWidth: 2 } },
              color: 'orangered', lineStyle: { lineWidth: 2, stroke: 'orangered' } }
          ],
          xAxis: {
            line: { style: { stroke: '#FFFFFF', lineWidth: 2 } },
            // line: { style: { stroke: '#444444', lineWidth: 2 } },
            // label: { style: { fill: 'black', fontWeight: 'bold', fontSize: 16 }, autoHide: false, autoRotate: true, formatter: (val) => { return val.split('休息').length > 1 ? '休息' : val } }
            label: { style: { fill: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }, autoHide: false, autoRotate: true, formatter: (val) => { return val.split('休息').length > 1 ? '休息' : val } }
          },
          yAxis: [
            { min: 0, max: 100,
              // line: { style: { stroke: '#444444', lineWidth: 2 } },
              line: { style: { stroke: '#FFFFFF', lineWidth: 2 } },
              // title: { text: '产能', style: { fill: 'black', fontSize: 24 } },
              title: { text: '产能', style: { fill: '#FFFFFF', fontSize: 24 } },
              // label: { style: { fill: 'black', fontSize: 18, fontWeight: 'bold' }, formatter: (val) => { return val } }},
              label: { style: { fill: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }, formatter: (val) => { return val } }},
            { min: 0, max: yMax, label: { formatter: () => '' } }
          ],
          legend: { position: 'top-right' },
          // label: { style: { fontSize: 12, fill: 'rgba(0,0,0,1)' }, formatter: (val) => { console.log(val); return val.value === 0 ? null : val.value } },
          label: { style: { fontSize: 12, fill: 'rgba(255, 255, 255, 1)' }, formatter: (val) => { console.log(val); return val.value === 0 ? null : val.value } },
          meta: { timeStr: { alias: '时间' }, value: { alias: '数量' }, target: { alias: '目标' } }
        })
        _this.renderCanvas.outputLine.render()
      }
      if (document.getElementById('g2-output-canvas-canvas').innerHTML !== '') { this.renderCanvas.outputLine.destroy(); CreateCanvas() }
      else CreateCanvas()
    },
    // 创建/更新 完成率柱状图
    CreateUpdateG2FinishColumn: function (dataList) {
      const finishColumnData = JSON.parse(JSON.stringify(dataList))
      // 更新 timeStr 字段 (休息时段添加休息 -> offset === null)
      finishColumnData.forEach(finishColumnDataRes => {
        if (finishColumnDataRes.offsetDay === null) finishColumnDataRes.timeStr = '休息 ' + finishColumnDataRes.timeStr
        if (finishColumnDataRes.value > 100) finishColumnDataRes.value = 100
      })
      // 如果原本已有数据，就更新数据。如果原本没有数据，就创建canvas
      if (document.getElementById('g2-finish-canvas-canvas').innerHTML === '') {
        this.renderCanvas.finishColumn = new Column('g2-finish-canvas-canvas', {
          data: finishColumnData,
          animation: false,
          autoFit: true,
          xField: 'timeStr',
          yField: 'value',
          padding: [30, 40, 90, 100],
          label: {
            position: 'middle',
            style: { fontWeight: 'bold', fill: 'black', fontSize: 16 },
            formatter: (val) => { return val.value === 0 ? null : val.value + '%' }
          },
          xAxis: {
            // line: { style: { stroke: '#444444', lineWidth: 2 } },
            // label: { style: { fill: 'black', fontWeight: 'bold', fontSize: 16 }, autoHide: false, autoRotate: true, formatter: (val) => { return val.split('休息').length > 1 ? '休息' : val } }
            line: { style: { stroke: '#FFFFFF', lineWidth: 2 } },
            label: { style: { fill: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }, autoHide: false, autoRotate: true, formatter: (val) => { return val.split('休息').length > 1 ? '休息' : val } }
          },
          yAxis: {
            min: 0, max: 100,
            // line: { style: { stroke: '#444444', lineWidth: 2 } },
            // title: { text: '完成率', style: { fill: 'black', fontSize: 24 } },
            // label: { style: { fill: 'black', fontSize: 18, fontWeight: 'bold' }, formatter: (val) => { return val+'%' } }
            line: { style: { stroke: '#FFFFFF', lineWidth: 2 } },
            title: { text: '完成率', style: { fill: '#FFFFFF', fontSize: 24 } },
            label: { style: { fill: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }, formatter: (val) => { return val+'%' } }
          },
          meta: { timeStr: { alias: '时间' }, value: { alias: '完成率' } },
          legend: { position: 'top-right' },
          color: 'yellow'
        })
        this.renderCanvas.finishColumn.render()
      }
      else this.renderCanvas.finishColumn.changeData(finishColumnData)
    },
    // 创建/更新 当天计划完成比例饼图
    CreateUpdateG2PlanPie: function (dataList) {
      const planPieData = JSON.parse(JSON.stringify(dataList))
      const pieData = [{ name: '已完成', value: planPieData.finishVal }, { name: '未完成', value: planPieData.unFinishVal }]
      // 如果原本已有数据，就更新数据。如果原本没有数据，就创建canvas
      if (document.getElementById('g2-plan-pie-canvas-canvas').innerHTML === '') {
        this.renderCanvas.planPie = new Pie('g2-plan-pie-canvas-canvas', {
          data: pieData,
          animation: false,
          autoFit: true,
          colorField: 'name',
          angleField: 'value',
          radius: .7,
          label: {
            type: 'inner', offset: '-0.5',
            content: ({ name, percent }) => { return `${name} ${(percent*100).toFixed(0)}%` },
            style: { fill: '#fff', fontSize: 14, textAlign: 'center' }
          },
          tooltip: false,
          legend: false,
          pieStyle: ({ name }) => {
            if (name === '已完成') return { fill: 'rgb(6, 192, 95)' }
            else if (name === '未完成') return { fill: 'rgb(233, 108, 91)' }
          }
        })
        this.renderCanvas.planPie.render()
      }
      else this.renderCanvas.planPie.changeData(pieData)
    },
    // 创建/更新 品质状况饼图
    CreateUpdateG2QualityPie: function (dataList) {
      const qualityPieData = JSON.parse(JSON.stringify(dataList))
      const pieData = [{ name: '合格', value: qualityPieData.qualificationVal }, { name: '不合格', value: qualityPieData.unQualificationVal }]
      // 如果原本已有数据，就更新数据。如果原本没有数据，就创建canvas
      if (document.getElementById('g2-quality-pie-canvas-canvas').innerHTML === '') {
        this.renderCanvas.qualityPie = new Pie('g2-quality-pie-canvas-canvas', {
          data: pieData,
          animation: false,
          autoFit: true,
          colorField: 'name',
          angleField: 'value',
          radius: .7,
          label: {
            type: 'inner', offset: '-0.5',
            content: ({ name, percent }) => { return `${name} ${(percent*100).toFixed(0)}%` },
            style: { fill: '#fff', fontSize: 14, textAlign: 'center' }
          },
          tooltip: false,
          legend: false,
          pieStyle: ({ name }) => {
            if (name === '合格') return { fill: 'rgb(6, 192, 95)' }
            else if (name === '不合格') return { fill: 'rgb(233, 108, 91)' }
          }
        })
        this.renderCanvas.qualityPie.render()
      }
      else this.renderCanvas.qualityPie.changeData(pieData)
    },
    // 更新为当前时间
    UpdateTime: function () {
      const date = new Date()
      function add0 (val) { return '0' + val }
      const year = date.getFullYear()
      const month = date.getMonth() < 9 ? add0(date.getMonth() + 1) : (date.getMonth() + 1)
      const day = date.getDate() < 10 ? add0(date.getDate()) : date.getDate()
      const hour = date.getHours() < 10 ? add0(date.getHours()) : date.getHours()
      const minute = date.getMinutes() < 10 ? add0(date.getMinutes()) : date.getMinutes()
      const second = date.getSeconds() < 10 ? add0(date.getSeconds()) : date.getSeconds()
      this.dateTime.date = year + '-' + month + '-' + day
      this.dateTime.time = hour + ':' + minute + ':' + second
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
    }
  }
}
</script>
