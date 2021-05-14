<template>
  <div class="by-new-table-content">
    <div class="by-new-table-content-header">
      <div class="by-new-table-content-image">
        <img :src="config.image" alt="比依logo" />
      </div>
      <div class="by-new-table-content-title">
        {{ config.title }}
      </div>
      <div class="by-new-table-content-time"></div>
    </div>
    <div class="by-new-table-content-body">
      <div>
        <div class="by-new-table-content-body-item-row">
          <div class="ds-title">{{ porcelainConfig[0].keyCh }}</div>
          <BYNewPorcelain v-for="i in 7"
                          :color="porcelainConfig[i].color"
                          :key="'by-new-porcelain-item-' + i"
                          :col="porcelainConfig[i].col"
                          :key-ch="porcelainConfig[i].keyCh"
                          :key-en="porcelainConfig[i].keyEn"
                          :value="porcelainConfig[i].value" />
        </div>
        <div class="by-new-table-content-body-item-row">
          <BYNewPorcelain v-for="i in 4"
                          :color="porcelainConfig2[i - 1].color"
                          :key="'by-new-porcelain-item-' + i"
                          :col="porcelainConfig2[i - 1].col"
                          :key-ch="porcelainConfig2[i - 1].keyCh"
                          :key-en="porcelainConfig2[i - 1].keyEn"
                          :value="porcelainConfig2[i - 1].value" />
        </div>
      </div>
      <div class="ds-item date-time-card"><DateTime /></div>
    </div>
    <div class="by-new-table-content-footer">
      <div class="by-new-table-content-footer-item-row">
        <div class="ds-table"
             v-for="i in 8"
             :key="'bi-yi-new-table-title-item-' + i"
             :style="{ color: porcelainConfig3[i - 1].color, width: porcelainConfig3[i - 1].col ? `${porcelainConfig3[i - 1].col * 192}px` : '192px' }">
          <div class="ds-table-ch">{{ porcelainConfig3[i - 1].keyCh }}</div>
          <div class="ds-table-en">{{ porcelainConfig3[i - 1].keyEn }}</div>
        </div>
      </div>
      <div class="by-new-table-content-footer-item-table">
        <div :style="tableList.length > 8 ? styleList.tableOverflow : {}">
          <div v-for="item in tableList" :key="item.id" class="content-footer-row">
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
  </div>
</template>

<script>
import BYNewPorcelain from '@/components/BYNewComponents/BYNewPorcelain/BYNewPorcelain'
import DateTime from '@/components/DateTime/DateTime'
import GetReadData from '@/api/readData'
import './by-new-table.css'

export default {
  name: 'BYNewTable',
  components: { BYNewPorcelain, DateTime },
  data: () => ({
    styleList: {
      tableOverflow: { animation: 'by-new-table-overflow 20s infinite linear' }
    },
    // 获取数据 定时器
    getDataInterval: null,
    // 页面配置
    pageConfig: {},
    // 瓷片配置
    porcelainConfig: [
      { id: 1, color: 'darkseagreen', keyCh: '-', keyEn: 'workshop', value: '', col: 1 },
      { id: 2, color: 'cornflowerblue', keyCh: '', keyEn: '', value: '', col: 1 },
      { id: 3, color: 'cornflowerblue', keyCh: '', keyEn: '', value: '', col: 1 },
      { id: 4, color: 'cornflowerblue', keyCh: '', keyEn: '', value: '', col: 1 },
      { id: 5, color: 'rebeccapurple', keyCh: '投入总量', keyEn: 'Input', value: 0, col: 1 },
      { id: 6, color: 'rebeccapurple', keyCh: '出勤人数', keyEn: 'Attendance', value: 0, col: 1 },
      { id: 7, color: 'rebeccapurple', keyCh: '目标产量', keyEn: 'Target', value: 0, col: 1 },
      { id: 8, color: 'rebeccapurple', keyCh: '实际产量', keyEn: 'Output', value: 0, col: 1 }
    ],
    porcelainConfig2: [
      { id: 9, color: 'mediumpurple', keyCh: '订单号', keyEn: 'Order ID', value: '', col: 2 },
      { id: 10, color: 'mediumpurple', keyCh: '机型', keyEn: 'Model Type', value: '', col: 2 },
      { id: 11, color: 'mediumpurple', keyCh: '品名', keyEn: 'Product Name', value: '', col: 2 },
      { id: 12, color: 'mediumpurple', keyCh: '客户', keyEn: 'Customer', value: '', col: 2 }
    ],
    porcelainConfig3: [
      { id: 1, color: '#8c939d', keyCh: '时段', keyEn: 'Time', col: 2  },
      { id: 2, color: '#8c939d', keyCh: '计划产量', keyEn: 'Plan', col: 1 },
      { id: 3, color: '#8c939d', keyCh: '实际产量', keyEn: 'Output', col: 1 },
      { id: 4, color: '#8c939d', keyCh: '不良数量', keyEn: 'Defect', col: 1 },
      { id: 5, color: '#8c939d', keyCh: '差异值', keyEn: 'Different', col: 1 },
      { id: 6, color: '#8c939d', keyCh: '完成率', keyEn: 'Finished', col: 1 },
      { id: 7, color: '#8c939d', keyCh: '不良率', keyEn: 'Defective Fraction', col: 2 },
      { id: 8, color: '#8c939d', keyCh: '维修', keyEn: 'Repair', col: 1 }
    ],
    // config 当前页面显示需要用的设置
    config: { title: '', image: '' },
    // table data
    tableList: []
  }),
  created: function () {
    console.log('views -> BYNew -> BYNewTable -> created')
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.optional = this.$route.query.optional
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
      this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
    }
  },
  mounted: function () {
    console.log('views -> BYNew -> BYNewTable -> mounted')

    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    this.GetData()
    this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.table)
  },
  beforeDestroy: function () {
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
  },
  methods: {
    GetData: async function () {
      console.log('views -> BYNew -> BYNewTable -> methods -> GetData')
      await GetReadData(this.$root.$data.store.devUrl + this.$root.$data.store.readDataUrl, this.pageConfig.configId, this.pageConfig.protocolNames).then(res => {
        console.log(res)

        // 处理获取得到的参数
        this.DialogParamData(res['param'])
        this.DialogDataData(res['dataList'])
        this.DialogSimulateData(res['simulateList'])
        console.error(this.tableList)
      })
    },
    // 处理 线体配置信息
    DialogParamData: function (paramRes) {
      console.log('views -> BYNew -> BYNewTable -> methods -> DialogParamData')
      const paramData = JSON.parse(JSON.stringify(paramRes))
      console.log(paramData)

      this.config.title = paramData.config.title
      this.config.image = paramData.config.logoPath
      // 线体名称 line-name
      if (paramData.useless && paramData.useless.group && paramData.useless.group.name) {
        this.porcelainConfig[0].keyCh = paramData.useless.group.name
      }
      /* staff */
      const staffArray = []
      if (paramData.staffList && paramData.staffList instanceof Array) {
        paramData.staffList.forEach(staffItem => {
          staffArray.push({ keyCh: staffItem.titleCh ? staffItem.titleCh : '-', keyEn: staffItem.titleEn ? staffItem.titleEn : '-', value: staffItem.name })
        })
        if (paramData.staffList.length > 3) staffArray.length = 3
        else if (paramData.staffList.length < 3) staffArray.push({ keyCh: '-', keyEn: '-', value: '-' })
      }
      staffArray.forEach((staffItem, staffIndex) => {
        this.porcelainConfig[staffIndex + 1] = { ...this.porcelainConfig[staffIndex + 1], ...staffItem }
      })

      /* table 框架, 目标总数 targetAll */
      const tableDataObj = { id: 1, time: ['', ''], startTime: {}, endTime: {}, plan: 0, input: 0, output: 0, defect: 0, different: 0, finished: '0%', defectiveFraction: '0%', repair: 0 }
      this.tableList = []
      // 目标总数 target
      this.porcelainConfig[6].value = 0
      if (paramData.dataList && paramData.dataList instanceof Array) {
        let timeArr = ['', '']
        paramData.dataList.forEach(tableRes => {
          if (tableRes.endTime && tableRes.endTime.time) {
            if (tableRes.startTime && tableRes.startTime.time) {
              timeArr = [tableRes.startTime.time, tableRes.endTime.time]
            }
          }
          this.tableList.push({ ...tableDataObj, id: tableRes.id, plan: tableRes.target, time: timeArr, startTime: tableRes.startTime, endTime: tableRes.endTime })
          // 目标总数 target
          this.porcelainConfig[6].value += tableRes.target
        })
      }

      /* 考勤 attendance.normal, 订单号 information.order, 机型 information.productModel, 品名 information.productName, 客户 information.orderCustomer */
      this.porcelainConfig[5].value = paramData.attendance.normal
      this.porcelainConfig2[0].value = paramData.information.orderCode
      this.porcelainConfig2[1].value = paramData.information.productModel
      this.porcelainConfig2[2].value = paramData.information.productName
      this.porcelainConfig2[3].value = paramData.information.orderCustomer
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      console.log('views -> BYNew -> BYNewTable -> methods -> DialogDataData')
      const dataData = JSON.parse(JSON.stringify(dataRes))
      console.log(dataData)
      console.warn(this.tableList)
      console.warn(dataData.dataList)
      if (dataData.dataList && dataData.dataList instanceof Array && dataData.dataList.length) {
        this.porcelainConfig[4].value = 0
        this.porcelainConfig[7].value = 0
        dataData.dataList.forEach(dataListRes => {
          if (this.tableList instanceof Array && this.tableList.length) {
            this.tableList.forEach(tableListRes => {
              if ((dataListRes.startTime.timeStamp === tableListRes.startTime.timeStamp) && (dataListRes.endTime.timeStamp === tableListRes.endTime.timeStamp)) {
                let inputNum = 0, outputNum = 0, uselessNum = 0
                dataListRes.productList.forEach(productRes => {
                  switch (productRes.state) {
                    case 'Ok': outputNum += productRes.value; break
                    case 'Input': inputNum += productRes.value; break
                    case 'Ng': uselessNum += productRes.value; break
                    default: break
                  }
                })
                tableListRes.input = inputNum
                tableListRes.output = outputNum
                tableListRes.defect = uselessNum
                tableListRes.different = (tableListRes.plan - outputNum) <= 0 ? 0 : (tableListRes.plan - outputNum)
                tableListRes.finished = (tableListRes.plan && outputNum) ? (outputNum * 100 / tableListRes.plan).toFixed(0) + '%' : '0%'
                tableListRes.defectiveFraction = (outputNum + uselessNum) <= 0 ? '0%' : (uselessNum * 100 / (outputNum + uselessNum)).toFixed(0) + '%'

                // 总投入数
                this.porcelainConfig[4].value += inputNum
                // 总产出数
                this.porcelainConfig[7].value += outputNum
              }
            })
          }
        })
      }
    },
    // 处理 模拟信息
    DialogSimulateData: function (simulateRes) {
      console.log('views -> BYNew -> BYNewTable -> methods -> DialogDataData')
      const simulateData = JSON.parse(JSON.stringify(simulateRes))
      console.log(simulateData)
    }
  }
}
</script>

<style scoped>

</style>
