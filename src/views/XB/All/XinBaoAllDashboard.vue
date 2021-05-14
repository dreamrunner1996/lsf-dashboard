<template>
  <div class="xin-bao-all-dashboard-content">
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
        <div class="information-table-content">
          <div class="information-table-title">{{ informationTable.title }}</div>
          <div class="information-table-description">{{ informationTable.description }}</div>
          <div class="information-table-context">
            <table :cellspacing="0" :cellpadding="0" border="1px">
              <tr><th v-for="slotItem in informationTable.slotList" :key="'information-table-slot-item-' + slotItem">{{ slotItem }}</th></tr>
              <tr v-if="informationTable.dataList.length === 0">
                <td colspan="11" style="color: #8c939d; font-size: 40px; height: 200px; line-height: 200px">没有数据</td>
              </tr>
              <tr class="information-table-tr" v-for="(dataListItem, dataListIndex) in informationTable.dataList" :key="'information-table-data-list-' + dataListIndex">
                <td v-for="(dataItem, dataIndex) in dataListItem" :key="`information-table-list-${dataListIndex}-item-${dataIndex}`">{{ dataItem }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="g2-all-output-finish-canvas-content">
          <div class="g2-all-output-canvas-content">
            <div class="g2-all-output-canvas-title">{{ outputAllLine.title }}</div>
            <div class="g2-all-output-canvas-description">{{ outputAllLine.description }}</div>
            <div class="g2-all-output-canvas-canvas" id="g2-all-output-canvas-canvas" />
          </div>
          <div class="g2-all-finish-canvas-content">
            <div class="g2-all-finish-canvas-title">{{ finishAllColumn.title }}</div>
            <div class="g2-all-finish-canvas-description">{{ finishAllColumn.description }}</div>
            <div class="g2-all-finish-canvas-canvas" id="g2-all-finish-canvas-canvas" />
          </div>
        </div>
      </div>
      <div class="content-body-right">
        <div class="g2-finish-all-pie-canvas-content">
          <div class="g2-finish-all-pie-canvas-title">{{ finishAllPie.title }}</div>
          <div class="g2-finish-all-pie-canvas-description">{{ finishAllPie.description }}</div>
          <div class="g2-finish-all-pie-canvas-canvas" id="g2-finish-all-pie-canvas-canvas" />
        </div>
        <div class="product-information-content">
          <div class="product-information-item">
            <div class="product-information-title">目标产量</div>
            <div class="product-information-value">{{ productInformation.target }}</div>
          </div>
          <div class="product-information-item">
            <div class="product-information-title">生产数量</div>
            <div class="product-information-value">{{ productInformation.output }}</div>
          </div>
        </div>
        <div class="g2-qualify-all-pie-canvas-content">
          <div class="g2-qualify-all-pie-canvas-title">{{ qualifiedAllPie.title }}</div>
          <div class="g2-qualify-all-pie-canvas-description">{{ qualifiedAllPie.description }}</div>
          <div class="g2-qualify-all-pie-canvas-canvas" id="g2-qualify-all-pie-canvas-canvas" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './XinBaoAllDashboard.css'
// import GetReadData from '@/api/readData'
import Axios from 'axios'

export default {
  name: 'XinBaoAllDashboard',
  data: () => ({
    // 页面配置
    pageConfig: {},
    /* 定时器 */
    updateTimeInterval: null, // 时间更新 (interval)
    getDataInterval: null, // 获取数据 扫描周期 (interval)
    /* 配置信息 */
    title: '-', // 标题
    logoPath: null, // 图片(logo) 地址
    dateTime: { date: '', week: '', time: '' }, // 时间 - 日期、星期、时分秒
    /* 表格信息 */
    informationTable: {
      title: '各产线信息',  // 标题
      description: '各产线人员、生产信息展示表',  // 副标题
      slotList: ['', '拉长', 'PQC', '出勤人数', '生产型号', '订单号', '订单数量', '目标产量', '当前产量', '完成比例', '合格率'],  // '内容标题'
      dataList: [
        {name: '线体1', staffLZ: '拉长A', staffPQC: 'PQC1', attendanceNum: 20, productSpec: 'ASD', orderCode: 'OBJ-221', orderNum: 2814, target: 827, output: 213, finish: '66%', qualification: '33%'},
        {name: '线体1', staffLZ: '拉长A', staffPQC: 'PQC1', attendanceNum: 20, productSpec: 'ASD', orderCode: 'OBJ-221', orderNum: 2814, target: 827, output: 213, finish: '66%', qualification: '33%'},
        {name: '线体1', staffLZ: '拉长A', staffPQC: 'PQC1', attendanceNum: 20, productSpec: 'ASD', orderCode: 'OBJ-221', orderNum: 2814, target: 827, output: 213, finish: '66%', qualification: '33%'},
        {name: '线体1', staffLZ: '拉长A', staffPQC: 'PQC1', attendanceNum: 20, productSpec: 'ASD', orderCode: 'OBJ-221', orderNum: 2814, target: 827, output: 213, finish: '66%', qualification: '33%'},
        {name: '线体1', staffLZ: '拉长A', staffPQC: 'PQC1', attendanceNum: 20, productSpec: 'ASD', orderCode: 'OBJ-221', orderNum: 2814, target: 827, output: 213, finish: '66%', qualification: '33%'}
      ]  // [{ name, staffLZ, staffPQC, attendanceNum, productSpec, orderCode, orderNum, target, output, finish, qualification }]
    },
    /* g2plot 图表 --> 投入产出趋势图、投入数量瀑布表、产出数量瀑布表 */
    renderCanvas: { outputAllLine: null, finishAllColumn: null, finishAllPie: null, qualifiedAllPie: null },
    /* 车间生产产量走势图 - 柱状-折线目标图(canvas) */
    outputAllLine: {
      title: '车间产能走势图',  // 标题
      description: '车间所有线体生产产能汇总走势图',  // 副标题
      dataList: []  // [{ ... }]
    },
    /* 车间每小时合格合格率走势图 - 柱状(canvas) */
    finishAllColumn: {
      title: '车间时段合格率详情',  // 标题
      description: '车间每时段所有线体产能合格率汇总图',  // 副标题
      dataList: []  // [{ ... }]
    },
    /* 目标完成比例 - 饼图(canvas) */
    finishAllPie: {
      title: '',  // 标题
      description: '',  // 副标题
      dataList: {},  // { ... }
    },
    /* 合格率 - 饼图(canvas) */
    qualifiedAllPie: {
      title: '',  // 标题
      description: '',  // 副标题
      dataList: {}  // { ... }
    },
    /* 目标生产、生产数量 - 详细数据 */
    productInformation: { target: 0, output: 0 }  // { target, output }
  }),
  created: function () {
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
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
    // this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.stack)
  },
  methods: {
    // 获取数据
    GetData: async function () {
      /* 获取数据 - 测试 */
      Axios.get('http://localhost:1234/api/mdcDashboard/dashboard/readAll').then(res => {
        console.log(res)
      })

      /* 获取数据 */
      // await GetReadData(this.$root.$data.store.devUrl + this.$root.$data.store.readDataUrl,
      //     this.pageConfig.configId,
      //     this.pageConfig.optional,
      //     this.pageConfig.produceSize,
      //     this.pageConfig.protocolNames
      // ).then(res => {
      //   console.error(res)
      // }).catch(err => { console.error(err) })
    },
    //
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
    }
  }
}
</script>
