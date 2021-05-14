<template>
  <div class="universal-stack-content">
    <div class="content-header">
      <!--   type: param data
             config.logoPath, config.title
      -->
      <img id="logo" :src="logoPath" alt="#" />
      <div class="title">{{ title }}</div>
      <div class="date-time">
        <div class="date">{{ dateTime.date }}</div>
        <div class="week">{{ dateTime.week }}</div>
        <div class="time">{{ dateTime.time }}</div>
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left">
        <!--    线体码垛感应器状态信息详细
                type: null  (可以在 read data 中找到 protocolList项)
                protocolList
        -->
        <StackStatusInformation :title="statusInformationList.title"
                                :description="statusInformationList.description"
                                :card-data="statusInformationList.data" />
      </div>
      <div class="content-body-right">
        <div class="content-body-right-line-card">
          <!--    当日产能情况趋势图
                  ant-g2Plot Line
                  type: read data [children]: param data, data data
                  param data: dataList - 时间段
                  data data: dataList.productList 数值
          -->
          <StackOutputLine :title="outputLineData.title"
                           :description="outputLineData.description"
                           chart-id="stack-output-line"
                           :chart-data="outputLineData.data" />
          <!--    当日线体数据显示
                  ant-g2Plot Liquid
                  type: read data [children]: param data, data data
                  param data: time, target
                  data data: time, value
          -->
          <StackProductInformationCard :title="productInformationCardData.title"
                                       :description="productInformationCardData.description"
                                       chart-id="stack-product-information-liquid"
                                       :chart-data="productInformationCardData.data"
                                       :information-list="productInformationCardData.dataList" />
        </div>
        <div class="content-body-right-column-waterfall">
          <!--    当日每时段产能详细柱状图
                  ant-g2Plot Column
                  type: read data [children]: param data, data data
                  param data: dataList - 时间段
                  data data: dataList.productList 数值
          -->
          <StackOutputColumn :title="outputColumnData.title"
                             :description="outputColumnData.description"
                             chart-id="stack-output-column"
                             :chart-data="outputColumnData.data" />
          <!--    每时段产能对比详细瀑布图
                  ant-g2Plot Waterfall
                  type: read data [children]: param data, data data
                  param data: dataList - 时间段
                  data data: dataList.productList 数值
          -->
          <StackOutputWaterfall :title="outputWaterfallData.title"
                                :description="outputWaterfallData.description"
                                chart-id="stack-output-waterfall"
                                :chart-data="outputWaterfallData.data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateAndTime from '../mixins/DateAndTime'
import getAndDialogReadData from '../mixins/GetAndDialogReadData'
import ProductType from '../../../api/DialogReadData/productType'
import StackStatusInformation from '../components/StackStatusInformation/StackStatusInformation'
import StackOutputLine from '../components/StackOutputLine/StackOutputLine'
import StackProductInformationCard from '../components/StackProductInformationCard/StackProductInformationCard'
import StackOutputColumn from '../components/StackOutputColumn/StackOutputColumn'
import StackOutputWaterfall from '../components/StackOutputWaterfall/StackOutputWaterfall'
import './universal-stack.css'

export default {
  // 导入包
  mixins: [ dateAndTime, getAndDialogReadData ],
  name: 'Stack',
  components: {
    StackStatusInformation,
    StackOutputLine,
    StackProductInformationCard,
    StackOutputColumn,
    StackOutputWaterfall
  },
  data: () => ({
    pageConfig: {},
    logoPath: '',
    title: '电子精益看板 (Dashboard)',
    typeList: ['Null', 'SmallBox'],
    statusInformationList: {
      title: '码垛状态信息',
      description: '线体码垛感应器状态信息详细',
      data: [
        { id: 1, ch: '产线托盘储备情况', en: 'Line pallet status', value: '-' },
        { id: 2, ch: '产线码垛满料情况', en: 'Line pallets reserve', value: '-' }
      ]
    },
    outputLineData: {
      title: '当日产能情况趋势图',
      description: '当日产能情况趋势图',
      data: [] // time, value
    },
    productInformationCardData: {
      title: '当日状况卡片',
      description: '当日线体数据显示',
      dataList: [
        { title: '当日总量', value: 0 },
        { title: '当前时段量', value: 0 },
        { title: '上一时段量', value: 0 }
      ], // title, value
      data: 0 // 水波图
    },
    outputColumnData: {
      title: '当日每时段产能详细柱状图',
      description: '当日每时段产能详细柱状图',
      data: [] // time, value
    },
    outputWaterfallData: {
      title: '每时段产能对比详细瀑布图',
      description: '每时段产能对比详细瀑布图',
      data: [] // title, value
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
    // 处理 页面配置数据
    DialogParamData: function (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))

      // logo 标题
      this.logoPath = paramRes.config.logoPath
      this.title = paramRes.config.title
      // dataList (时间配置) --
      this.outputLineData.data = [] // ...paramDataListRes, title, value
      this.productInformationCardData.data = 0
      this.productInformationCardData.dataList.forEach(informationCardDataListRes => {
        informationCardDataListRes.value = 0
      })
      this.outputColumnData.data = [] // ...paramDataListRes, title, value
      this.outputWaterfallData.data = [] // ...paramDataListRes, title, value

      paramData.dataList.forEach(paramDataListRes => {
        this.outputLineData.data.push({ ...paramDataListRes, title: paramDataListRes.timeStr, value: 0 })
        this.outputColumnData.data.push({ ...paramDataListRes, title: paramDataListRes.timeStr, value: 0 })
        this.outputWaterfallData.data.push({ ...paramDataListRes, title: paramDataListRes.timeStr, value: 0 })
      })
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      const nowTime = new Date().valueOf()
      const lastTimeObj = { nowIndex: 0, index: 0, startTime: 0, endTime: 0, value: 0 }
      dataData.dataList.forEach(dataDataListRes => {
        const dtObj = ProductType(dataDataListRes.productList, this.typeList)
        this.outputLineData.data.forEach((outputLineDataRes, outputLineDataIndex) => {
          if (dataDataListRes.startTime.timeStamp === outputLineDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === outputLineDataRes.endTime.timeStamp) {
            outputLineDataRes.value += dtObj.ok

            // 顺便获取上一个时段的时间戳
            if (dataDataListRes.startTime.timeStamp <= nowTime && nowTime <= dataDataListRes.endTime.timeStamp) {
              if (outputLineDataIndex > 0) {
                lastTimeObj.nowIndex = outputLineDataIndex
                lastTimeObj.index = outputLineDataIndex - 1
                lastTimeObj.startTime = this.outputLineData.data[outputLineDataIndex - 1].startTime.timeStamp
                lastTimeObj.endTime = this.outputLineData.data[outputLineDataIndex - 1].endTime.timeStamp
                lastTimeObj.value += this.outputLineData.data[outputLineDataIndex - 1].value
              } else {
                lastTimeObj.nowIndex = 0
              }
            }
          }
        })
        this.outputColumnData.data.forEach(outputColumnRes => {
          if (dataDataListRes.startTime.timeStamp === outputColumnRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === outputColumnRes.endTime.timeStamp) outputColumnRes.value += dtObj.ok
        })
        this.outputWaterfallData.data.forEach(outputWaterfallRes => {
          if (dataDataListRes.startTime.timeStamp === outputWaterfallRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === outputWaterfallRes.endTime.timeStamp) outputWaterfallRes.value += dtObj.ok
        })
        this.productInformationCardData.dataList[0].value += dtObj.ok
        if (dataDataListRes.startTime.timeStamp <= nowTime && nowTime <= dataDataListRes.endTime.timeStamp) this.productInformationCardData.dataList[1].value += dtObj.ok
      })
      this.productInformationCardData.dataList[2].value += lastTimeObj.value

      if (this.productInformationCardData.dataList[1].value <= 0) this.productInformationCardData.data = 0
      else if (this.productInformationCardData.dataList[2].value <= 0) this.productInformationCardData.data = 1
      else this.productInformationCardData.data = (this.productInformationCardData.dataList[1].value / this.productInformationCardData.dataList[2].value).toFixed(4) * 1
    },
    // 处理 protocolNames 数据
    DialogProtocolNamesData (protocolData) {
      if (protocolData && protocolData instanceof Object && Object.keys(protocolData).length) {
        const protocolNamesArr = Object.keys(protocolData)
        protocolNamesArr.forEach(protocolNamesArrRes => {
          if (protocolNamesArrRes.split('StackPalletStatus').length > 1) {
            this.$set(this.statusInformationList.data[0], 'value', protocolData[protocolNamesArrRes])
            this.$set(this.statusInformationList.data[0], 'status', this.PalletStatusDisc(protocolData[protocolNamesArrRes]))
          }
          if (protocolNamesArrRes.split('StackPalletsReserve').length > 1) {
            this.$set(this.statusInformationList.data[1], 'value', protocolData[protocolNamesArrRes])
            this.$set(this.statusInformationList.data[1], 'status', this.PalletReverseDisc(protocolData[protocolNamesArrRes]))
          }
        })
      }
    },
    // 处理 children信息
    DialogChildrenData: function (childrenData) {
      if (childrenData.length) {
        childrenData.forEach(childrenDataItem => {
          this.DialogDataData(childrenDataItem['dataList'])
          this.DialogChildrenData(childrenDataItem['children'])
        })
      }
    },
    // 字典
    PalletStatusDisc (disc) {
      switch (disc) {
        case 0: return '空闲 Free'
        case 10: return '正常 Normal'
        case 20: return '满料 Full'
        default: return '未判断 UnKnow'
      }
    },
    PalletReverseDisc (disc) {
      switch (disc) {
        case 0: return '空闲 Free'
        case 10: return '码货中 Stacking'
        case 20: return '满料 Full'
        default: return '未判断 UnKnow'
      }
    }
  }
}
</script>
