<template>
  <div class="universal-stack-clear-content">
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
      <div class="show-detail-item"
           v-for="detailItem in detailCards"
           :key="'show-detail-item-' + detailItem.title">
        <div class="title">{{ detailItem.title }}</div>
        <div class="value">{{ detailItem.value }}</div>
      </div>
      <div class="universal-stack-clear-liquid">
        <StackClearOutputLiquid :chart-id="outputLiquid.chartId" :chart-data="outputLiquid.chartData" />
      </div>
    </div>
    <div class="content-body">
      <div class="stack-information-card-content">
        <StackClearStatusInformation :title="statusInformation.title" :status-list="statusInformation.dataList" />
      </div>
      <div class="stack-charts-card-content">
        <div class="stack-output-line-content">
          <StackClearOutputLine :title="outputLine.title" :chart-id="outputLine.title" :chart-data="outputLine.dataList" />
        </div>
        <div class="stack-output-waterfall-content">
          <StackClearOutputWaterfall :title="outputWaterfall.title" :chart-id="outputWaterfall.chartId" :chart-data="outputWaterfall.dataList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* mixins */
import dateAndTime from '../mixins/DateAndTime'
import getAndDialogReadData from '../mixins/GetAndDialogReadData'
/* Components */
import StackClearOutputLiquid from '../components/ClearStackOutputLiquid/StackClearOutputLiquid'
import StackClearStatusInformation from '../components/ClearStackStatusInformation/StackClearStatusInformation'
import StackClearOutputLine from '../components/ClearStackOutputLine/StackClearOutputLine'
import StackClearOutputWaterfall from '../components/ClearStackOutputWaterfall/StackClearOutputWaterfall'
/* style - css */
import './universal-stack-clear.css'
import ProductType from '../../../api/DialogReadData/productType'

export default {
  // 导入包
  mixins: [ dateAndTime, getAndDialogReadData ],
  components: { StackClearOutputLiquid, StackClearStatusInformation, StackClearOutputLine, StackClearOutputWaterfall },
  name: 'UniversalStackClear',
  data: () => ({
    typeList: ['Null', 'SmallBox'],
    logoTitleConfig: {
      logoPath: '',
      title: ''
    },
    detailCards: [
      { title: '当日总额', value: 0 },
      { title: '当前时段额度', value: 0 },
      { title: '上一时段额度', value: 0 }
    ],
    outputLiquid: {
      chartId: 'universal-stack-clear-output-liquid',
      chartData: 0
    },
    statusInformation: {
      title: '码垛状态信息',
      dataList: [
        { title: '产线托盘储备情况', titleEn: 'Line pallet status', status: '-' },
        { title: '产线码垛满料情况', titleEn: 'Line pallets reserve', status: '-' }
      ]
    },
    outputLine: {
      title: '当日产能情况趋势图',
      chartId: 'universal-stack-clear-output-line',
      dataList: []    // time, value
    },
    outputWaterfall: {
      title: '每时段产能详细瀑布图',
      chartId: 'universal-stack-clear-output-waterfall',
      dataList: []    // time, value
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
    // 处理 网页配置数据
    DialogParamData: function (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))

      // logo 标题
      this.$set(this.logoTitleConfig, 'logoPath', paramRes.config.logoPath)
      this.$set(this.logoTitleConfig, 'title', paramRes.config.title)

      this.detailCards.forEach(detailsCardRes => {
        this.$set(detailsCardRes, 'value', 0)
      })
      this.$set(this.outputLiquid, 'chartData', 0)

      this.outputLine.dataList = []
      this.outputWaterfall.dataList = []
      paramData.dataList.forEach(paramDataListRes => {
        this.outputLine.dataList.push({ ...paramDataListRes, time: paramDataListRes.timeStr, value: 0 })
        this.outputWaterfall.dataList.push({ ...paramDataListRes, time: paramDataListRes.timeStr, value: 0 })
      })
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      const nowTime = new Date().valueOf()
      const lastTimeObj = { nowIndex: 0, index: 0, startTime: 0, endTime: 0, value: 0 }
      dataData.dataList.forEach(dataDataListRes => {
        const dtObj = ProductType(dataDataListRes.productList, this.typeList)
        this.outputLine.dataList.forEach((outputLineDataRes, outputLineDataIndex) => {
          if (dataDataListRes.startTime.timeStamp === outputLineDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === outputLineDataRes.endTime.timeStamp) {
            outputLineDataRes.value += dtObj.ok

            // 顺便获取上一个时段的时间戳
            if (dataDataListRes.startTime.timeStamp <= nowTime && nowTime <= dataDataListRes.endTime.timeStamp) {
              if (outputLineDataIndex > 0) {
                lastTimeObj.nowIndex = outputLineDataIndex
                lastTimeObj.index = outputLineDataIndex - 1
                lastTimeObj.startTime = this.outputLine.dataList[outputLineDataIndex - 1].startTime.timeStamp
                lastTimeObj.endTime = this.outputLine.dataList[outputLineDataIndex - 1].endTime.timeStamp
                lastTimeObj.value += this.outputLine.dataList[outputLineDataIndex - 1].value
              } else {
                lastTimeObj.nowIndex = 0
              }
            }
          }
        })
        this.outputWaterfall.dataList.forEach(outputWaterfallRes => {
          if (dataDataListRes.startTime.timeStamp === outputWaterfallRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === outputWaterfallRes.endTime.timeStamp) outputWaterfallRes.value += dtObj.ok
        })
        this.detailCards[0].value += dtObj.ok
        if (dataDataListRes.startTime.timeStamp <= nowTime && nowTime <= dataDataListRes.endTime.timeStamp) this.detailCards[1].value += dtObj.ok
      })
      this.detailCards[2].value += lastTimeObj.value

      if (this.detailCards[1].value <= 0) this.outputLiquid.chartData = 0
      else if (this.detailCards[2].value <= 0) this.outputLiquid.chartData = 1
      else this.outputLiquid.chartData = (this.detailCards[1].value / this.detailCards[2].value).toFixed(4) * 1
    },
    // 处理 protocolNames 数据
    DialogProtocolNamesData (protocolData) {
      if (protocolData && protocolData instanceof Object && Object.keys(protocolData).length) {
        const protocolNamesArr = Object.keys(protocolData)
        protocolNamesArr.forEach(protocolNamesArrRes => {
          if (protocolNamesArrRes.split('StackPalletStatus').length > 1) {
            this.$set(this.statusInformation.dataList[0], 'value', protocolData[protocolNamesArrRes])
            this.$set(this.statusInformation.dataList[0], 'status', this.PalletStatusDisc(protocolData[protocolNamesArrRes]))
          }
          if (protocolNamesArrRes.split('StackPalletsReserve').length > 1) {
            this.$set(this.statusInformation.dataList[1], 'value', protocolData[protocolNamesArrRes])
            this.$set(this.statusInformation.dataList[1], 'status', this.PalletReverseDisc(protocolData[protocolNamesArrRes]))
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

<style scoped>

</style>
