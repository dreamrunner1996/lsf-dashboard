<template>
  <div class="universal-line-clear-content">
    <div class="content-header">
      <div class="logo-time-title-card-content">
        <div class="logo-time-content">
          <div class="logo-content">
            <img :src="logoTitleConfig.logoPath" alt="#" />
          </div>
          <div class="time-content">
            <div class="date">{{ dateTime.date }}</div>
            <div class="week">{{ dateTime.week }}</div>
            <div class="time">{{ dateTime.time }}</div>
          </div>
        </div>
        <div class="divider" />
        <div class="title-content">{{ logoTitleConfig.title }}</div>
      </div>
      <div class="order-custom-information-content">
        <div class="title">订单信息</div>
        <div class="order-custom-information-item"
             v-for="(orderCustomItem, orderCustomerIndex) in informationData.orderCustom.key"
             :key="'customer-item-' + orderCustomItem">
          <div class="key">{{ informationData.orderCustom.title[orderCustomerIndex] }}</div>
          <div class="value">{{ informationData.orderCustom.value[orderCustomerIndex] }}</div>
        </div>
      </div>
      <div class="product-information-content">
        <div class="title">产品信息</div>
        <div class="product-information-item"
             v-for="(productItem, productIndex) in informationData.product.key"
             :key="'information-' + productItem">
          <div class="key">{{ informationData.product.title[productIndex] }}</div>
          <div class="value">{{ informationData.product.value[productIndex] }}</div>
        </div>
      </div>
      <div class="attendance-card-content">
        <LineClearAttendanceCard :chart-id="attendance.chartId" :chart-data="attendance.dataList" />
      </div>
    </div>
    <div class="content-body">
      <div class="staff-card-content">
        <LineClearStaffCard :staff-data="staffData" />
      </div>
      <div class="product-table-content">
        <LineClearOutputTable :table-data="productTable.dataList" :table-column="productTable.columnList" :table-key="productTable.keyList" />
      </div>
      <div class="product-charts-content">
        <LineClearOutputLine :chart-id="outputLine.chartId" :chart-data="outputLine.dataList" />
        <LineClearOutputWaterfall :chart-id="outputWaterfall.chartId" :chart-data="outputWaterfall.dataList" />
      </div>
    </div>
  </div>
</template>

<script>
/* mixins */
import dateAndTime from '../mixins/DateAndTime'
import getAndDialogReadData from '../mixins/GetAndDialogReadData'
/* Components */
import LineClearAttendanceCard from '../components/ClearLineAttendanceCard/LineClearAttendanceCard'
import LineClearStaffCard from '../components/ClearLineStaffCard/LineClearStaffCard'
import LineClearOutputTable from '../components/ClearLineOutputTable/LineClearOutputTable'
import LineClearOutputLine from '../components/ClearLineOutputLine/LineClearOutputLine'
import LineClearOutputWaterfall from '../components/ClearLineOutputWaterfall/LineClearOutputWaterfall'
/* product-type select */
import ProductType from '../../../api/DialogReadData/productType'
/* style - css */
import './universal-line-clear.css'

export default {
  // 导入包
  mixins: [ dateAndTime, getAndDialogReadData ],
  components: { LineClearAttendanceCard, LineClearStaffCard, LineClearOutputTable, LineClearOutputLine, LineClearOutputWaterfall },
  name: 'UniversalLineClear',
  data: () => ({
    typeList: ['Null', 'SmallBox'],
    logoTitleConfig: {
      logoPath: '',
      title: ''
    },
    informationData: {
      orderCustom: {
        title: ['订单号', '订单数量', '订单目的地', '客户'],
        key: ['orderCode', 'orderNum', 'orderDestination', 'orderCustomer'],
        value: []
      },
      product: {
        title: ['产品型号', '产品规格', '产品名称', ''],
        key: ['productModel', 'productSpec', 'productName', ''],
        value: []
      }
    },
    attendance: {
      chartId: 'universal-line-clear-attendance-chart',
      title: ['正常', '请假', '缺勤'],
      key: ['normal', 'leave', 'absence'],
      dataList: []
    },
    staffData: [],
    productTable: {
      columnList: ['时间', '目标', '投入', '合格', '不良', '维修'],
      keyList: ['time', 'target', 'input', 'output', 'useless', 'repair'],
      dataList: []
    },
    outputLine: {
      chartId: 'universal-line-clear-output-line',
      dataList: []
    },
    outputWaterfall: {
      chartId: 'universal-line-clear-output-waterfall',
      dataList: []
    }
  }),
  created: function () {
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.optional = this.$route.query.optional
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
      this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
    }
  },
  methods: {
    DialogParamData: function (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))

      // logo 标题
      this.$set(this.logoTitleConfig, 'logoPath', paramData.config.logoPath)
      this.$set(this.logoTitleConfig, 'title', paramData.config.title)

      // dataList (时间配置)
      this.productTable.dataList = []
      this.outputLine.dataList = []
      this.outputWaterfall.dataList = []

      this.informationData.orderCustom.value = []
      this.informationData.orderCustom.key.forEach(orderCustomKey => {
        this.informationData.orderCustom.value.push(paramData.information[orderCustomKey])
      })
      this.informationData.product.value = []
      this.informationData.product.key.forEach(productKey => {
        this.informationData.product.value.push(paramData.information[productKey])
      })

      this.attendance.dataList = []   // name, value
      this.attendance.key.forEach((attendanceKey, attendanceIndex) => {
        this.attendance.dataList.push({ name: this.attendance.title[attendanceIndex], value: paramData.attendance[attendanceKey] })
      })

      this.staffData = []  //id, titleCh, titleEn, titleStr, name, contact, image
      function TitleStrCreate (titleCh, titleEn) {
        if (titleCh && !titleEn) return `${titleCh}`
        else if (titleCh && titleEn) return `${titleCh} (${titleEn})`
        else if (!titleCh && titleEn) return `${titleEn}`
        else return '-'
      }
      paramData.staffList.forEach(staffRes => {
        this.staffData.push({
          ...staffRes,
          titleStr: TitleStrCreate(staffRes.titleCh, staffRes.titleEn)
        })
      })

      paramData.dataList.forEach(paramDataListRes => {
        this.productTable.dataList.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          target: paramDataListRes.offsetDay === null ? null : paramDataListRes.target,
          input: paramDataListRes.offsetDay === null ? null : 0,
          output: paramDataListRes.offsetDay === null ? null : 0,
          useless: paramDataListRes.offsetDay === null ? null : 0,
          repair: paramDataListRes.offsetDay === null ? null : 0
        })
        this.outputLine.dataList.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          target: paramDataListRes.offsetDay === null ? null : paramDataListRes.target,
          output: paramDataListRes.offsetDay === null ? null : 0
        })
        this.outputWaterfall.dataList.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          value: paramDataListRes.offsetDay = 0
        })
      })
    },
    DialogDataData: function (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      dataData.dataList.forEach(dataDataListRes => {
        const dtObj = ProductType(dataDataListRes.productList, this.typeList)

        this.productTable.dataList.forEach(productTableDataListRes => {
          if (dataDataListRes.startTime.timeStamp === productTableDataListRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === productTableDataListRes.endTime.timeStamp) {
            productTableDataListRes.input += dtObj.input
            productTableDataListRes.output += dtObj.ok
            productTableDataListRes.useless += dtObj.ng
            productTableDataListRes.repair += dtObj.repair
          }
        })
        this.outputLine.dataList.forEach(outputLineDataListRes => {
          if (dataDataListRes.startTime.timeStamp === outputLineDataListRes['startTime'].timeStamp && dataDataListRes.endTime.timeStamp === outputLineDataListRes['endTime'].timeStamp) {
            outputLineDataListRes.output += dtObj.ok
          }
        })
        this.outputWaterfall.dataList.forEach(outputWaterfallDataListRes => {
          if (dataDataListRes.startTime.timeStamp === outputWaterfallDataListRes['startTime'].timeStamp && dataDataListRes.endTime.timeStamp === outputWaterfallDataListRes['endTime'].timeStamp) {
            outputWaterfallDataListRes.value += dtObj.ok
          }
        })
      })
    },
    // 处理 children信息
    DialogChildrenData: function (childrenData) {
      if (childrenData.length) {
        childrenData.forEach(childrenDataItem => {
          this.DialogDataData(childrenDataItem['dataList'])
          this.DialogChildrenData(childrenDataItem['children'])
        })
      }
    }
  }
}
</script>
