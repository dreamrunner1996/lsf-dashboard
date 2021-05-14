<template>
  <div class="by-new-stack-content">
    <div class="by-new-stack-content-header">
      <div class="by-new-stack-content-image">
        <img :src="config.image" alt="比依logo" />
      </div>
      <div class="by-new-stack-content-title">
        {{ config.title }}
      </div>
      <div class="by-new-stack-content-time">
        <BYNewDateTime />
      </div>
    </div>
    <div class="by-new-stack-content-body">
      <div class="content-body-row" v-for="item in dataList" :key="'three-row-' + item.id">
        <div class="content-body-row-item">
          <div>{{ item.ch }}</div>
          <div>{{ item.en }}</div>
        </div>
        <div class="content-body-row-item">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import './by-new-stack.css'
import GetReadData from '@/api/readData'
import BYNewDateTime from '@/components/BYNewComponents/BYNewDateTime/BYNewDateTime'

export default {
  name: 'BYNewStack',
  components: { BYNewDateTime },
  data: () => ({
    // 页面配置
    pageConfig: {},
    // config 当前页面显示需要用的设置
    config: { title: '', image: '' },
    // 3行信息
    dataList: [
      { id: 1, ch: '实际产量', en: 'Actual Output', value: 0 },
      { id: 2, ch: '产线托盘储备情况', en: 'Line pallet status', value: '-' },
      { id: 3, ch: '产线码垛满料情况', en: 'Line pallets reserve', value: '-' }
    ],
    // pallets 状态
    palletsList: {
      palletStatus: '',
      palletsReserve: ''
    }
  }),
  created: function () {
    console.log('views -> BYNew -> BYNewStack -> created')
    // 获取当前页面 数据源
    if (this.$route.query) {
      this.pageConfig.configId = this.$route.query.configId
      this.pageConfig.optional = this.$route.query.optional
      this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : []
      this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
    }
    console.error(this.$route.query.palletStatus)
    console.error(this.pageConfig.protocolNames)
    if (this.$route.query.palletStatus) {
      this.pageConfig.protocolNames = [...this.pageConfig.protocolNames, this.$route.query.palletStatus]
      this.palletsList.palletStatus = this.$route.query.palletStatus
    }
    if (this.$route.query.palletsReserve) {
      this.pageConfig.protocolNames = [...this.pageConfig.protocolNames, this.$route.query.palletsReserve]
      this.palletsList.palletsReserve = this.$route.query.palletsReserve
    }
    console.log(this.pageConfig.protocolNames)
  },
  mounted: function () {
    console.log('views -> BYNew -> BYNewStack -> mounted')
    if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    this.GetData()
    this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.table)
  },
  watch: {
    '$route.query': function () {
      console.log('watch -> `$route.query`')
      // 获取当前页面 数据源
      if (this.$route.query) {
        this.pageConfig.configId = this.$route.query.configId
        this.pageConfig.optional = this.$route.query.optional
        this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
        this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
      }
      if (this.$route.query.palletStatus) {
        this.pageConfig.protocolNames = [...this.pageConfig.protocolNames, this.$route.query.palletStatus]
        this.palletsList.palletStatus = this.$route.query.palletStatus
      }
      if (this.$route.query.palletsReserve) {
        this.pageConfig.protocolNames = [...this.pageConfig.protocolNames, this.$route.query.palletsReserve]
        this.palletsList.palletsReserve = this.$route.query.palletsReserve
      }
    }
  },
  methods: {
    GetData: async function () {
      console.log('views -> BYNew -> BYNewStack -> methods -> GetData')
      await GetReadData(this.$root.$data.store.devUrl + this.$root.$data.store.readDataUrl,
          this.pageConfig.configId,
          this.pageConfig.protocolNames,
          ['children']).then(res => {
      // await GetReadData('http://localhost:1234/api/mdcDashboard/dashboard/readAll').then(res => {
        console.log(res)
        this.dataList[0].value = 0
        this.DialogParamData(res['param'])
        this.DialogDataData(res['dataList'])
        this.DialogChildrenData(res['children'])
        this.DialogProtocolNamesData(res['protocolList'])
      })
    },
    // 处理 配置信息
    DialogParamData: function (paramRes) {
      console.log('views -> BYNew -> BYNewStack -> methods -> DialogParamData')
      const paramData = JSON.parse(JSON.stringify(paramRes))
      this.config.title = paramData.config.title
      this.config.image = paramData.config.logoPath
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      console.log('views -> BYNew -> BYNewStack -> methods -> DialogDataData')
      const dataData = JSON.parse(JSON.stringify(dataRes))
      if (dataData.dataList && dataData.dataList instanceof Array && dataData.dataList.length) {
        dataData.dataList.forEach(dataDataItem => {
          if (dataDataItem.productList && dataDataItem.productList instanceof Array && dataDataItem.productList.length) {
            // let inputNum = 0, uselessNum = 0
            dataDataItem.productList.forEach(productRes => {
              switch (productRes.state) {
                case 'Ok': this.dataList[0].value += productRes.value; break
                // case 'Input': inputNum += productRes.value; break
                // case 'Ng': uselessNum += productRes.value; break
                default: break
              }
            })
          }
        })
      }
    },
    // 处理 children信息
    DialogChildrenData: function (childrenData) {
      console.log('views -> BYNew -> BYNewStack -> methods -> DialogChildrenData')
      if (childrenData.length) {
        childrenData.forEach(childrenDataItem => {
          // this.DialogParamData(childrenDataItem['param'])
          this.DialogDataData(childrenDataItem['dataList'])
          this.DialogChildrenData(childrenDataItem['children'])
        })
      }
    },
    // 处理 protocol 信息
    DialogProtocolNamesData: function (protocolRes) {
      console.log('views -> BYNew -> BYNewStack -> methods -> DialogProtocolNamesData')
      const protocolData = JSON.parse(JSON.stringify(protocolRes))
      if (protocolData instanceof Object) {
        if (Object.keys(protocolData).length) {
          Object.values(protocolData).forEach((protocolItem, protocolIndex) => {
            if (protocolIndex === 0) {
              this.palletsList.palletStatus = protocolItem
              this.dataList[1].value = this.PalletStatusDisc(protocolItem)
            }
            if (protocolIndex === 1) {
              this.palletsList.palletsReserve = protocolItem
              this.dataList[2].value = this.PalletReverseDisc(protocolItem)
            }
          })
        }
      }
    },
    // pallet-status 字典
    PalletStatusDisc (disc) {
      switch (disc) {
        case 0: return '空闲 Free'
        case 10: return '正常 Normal'
        case 20: return '满料 Full'
        default: return '未判断 UnKnow'
      }
    },
    // pallet-reverse 字典
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
