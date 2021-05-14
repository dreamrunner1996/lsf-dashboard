<template>
  <div class="stack-dashboard-content">
    <div class="content-header">
      <div class="img"><img :src="imgLogo" width="384" height="108" alt="#"></div>
      <div class="title">{{ title }}</div>
      <div class="none">
        <div style="font-size: 28px">{{ date }}</div>
        <div style="font-size: 45px">{{ time }}</div>
      </div>
    </div>
    <div class="content-body">
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
import './stack-dashboard.css'
import Axios from 'axios'

const imgLogo = require('@/assets/dash-logo.png')

export default {
  name: 'StackDashboard',
  data: () => ({
    tInterval: null,
    tOut1: null,
    timeOut: null,
    datasource: '',
    imgLogo,
    dtArray: ['', ''],
    date: '',
    time: '',
    title: '电子精益看板 (Lean Production Display)',
    lineTitle: 'C1线',
    dataList: [
      { id: 1, ch: '实际产量', en: 'Actual Output', value: 0 },
      { id: 2, ch: '产线托盘储备情况', en: 'Line pallet status', value: '-' },
      { id: 3, ch: '产线码垛满料情况', en: 'Line pallets reserve', value: '-' }
    ]
  }),
  created () {
    this.tInterval = true
    if (this.$route.query.datasource) {
      this.datasource = this.$route.query.datasource
    }
    if (this.$route.query.palletStatus && this.$route.query.palletsReserve) {
      this.dtArray = [this.$route.query.palletStatus, this.$route.query.palletsReserve]
    }
  },
  mounted () {
    this.UpdateTime()
    this.GetData()
    if (this.tInterval) {
      this.tOut1 = window.setInterval(this.GetData, this.$root.$data.store.scanTime.stack)
      this.timeOut = window.setInterval(this.UpdateTime, 1000)
    }
  },
  beforeDestroy () {
    this.tInterval = false
    window.clearInterval(this.tOut1)
    window.clearInterval(this.timeOut)
    this.tOut1 = null
    this.timeOut = null
  },
  watch: {
    '$route.query': function () {
      this.datasource = ''
      this.imgLogo = imgLogo
      this.dtArray = ['', '']
      this.date = ''
      this.time = ''
      this.title = '电子精益看板 (Lean Production Display)'
      this.lineTitle = '线名'
      this.dataList = [
        { id: 1, ch: '实际产量', en: 'Actual Output', value: 0 },
        { id: 2, ch: '产线托盘储备情况', en: 'Line pallet status', value: '-' },
        { id: 3, ch: '产线码垛满料情况', en: 'Line pallets reserve', value: '-' }
      ]

      if (this.$route.query.datasource) {
        this.datasource = this.$route.query.datasource
      }
      if (this.$route.query.palletStatus && this.$route.query.palletsReserve) {
        this.dtArray = [this.$route.query.palletStatus, this.$route.query.palletsReserve]
      }
      this.GetData()
    }
  },
  methods: {
    GetData () {
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.displayParams + `?datasource=${this.datasource}`).then(res => {
        if (res.data && res.data instanceof Array && res.data.length) {
          let getData = res.data
          this.title = getData.find(res => (res.datasource === this.datasource)).data.title
          this.imgLogo = getData.find(res => (res.datasource === this.datasource)).data.logoPath
          getData = null
          console.error(res.data)
        }
        Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.product + `?datasource=${this.datasource}`).then(res1 => {
          console.error(res.data)
          if (res1.data && res1.data instanceof Array && res1.data.length) {
            let getData = res1.data
            let allNum = 0
            getData.forEach(getDataRes => {
              getDataRes.data.forEach(getDataResData => {
                if (getDataResData && getDataResData['categoryList'] instanceof Array && getDataResData['categoryList'].length) {
                  getDataResData['categoryList'].forEach(gc => {
                    if ((gc.status === 'Ok' || gc.status === 'Repair') && gc.type === 'SmallBox') allNum += gc.count
                  })
                }
              })
            })
            this.dataList[0].value = allNum
            allNum = null
            getData = null
          }
        })
      })
      Axios.get(this.$root.$data.store.devUrl + this.$root.$data.store.readProtocol + `?names=${this.dtArray[0]}&names=${this.dtArray[1]}`).then(res => {
        console.error(res.data)
        if (res.data && res.data instanceof Array && res.data.length) {
          let getData = res.data
          this.DialogData3(getData)
          getData = null
        }
      })
    },
    DialogData3 (resData) {
      this.dataList[1].value = this.PalletStatusDisc(resData[0].data)
      this.dataList[2].value = this.PalletReverseDisc(resData[1].data)
    },
    UpdateTime () {
      let date = new Date()
      this.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
      this.time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
      date = null
    },
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
