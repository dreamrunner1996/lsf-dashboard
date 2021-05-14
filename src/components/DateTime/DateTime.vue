<template>
  <div class="date-time-content">
    <div class="date-week">{{ date }}</div>
    <div class="time">{{ time }}</div>
<!--    <div class="time-zone">{{ zone }}</div>-->
  </div>
</template>

<script>
import './date-time.css'

export default {
  name: 'DateTime',
  data: () => ({
    timeInterval: null,
    timeOut: null,
    updateBoolean: null,
    date: '-',
    time: '-',
    week: '-',
    zone: '时区 - Asia/Shanghai'
  }),
  mounted () {
    this.updateBoolean = true
    this.timeOut = true
    this.UpdateTime()
    if (this.timeInterval) window.clearInterval(this.timeInterval)
    this.timeInterval = window.setInterval(this.UpdateTime, 1000)
  },
  beforeDestroy () {
    this.updateBoolean = null
    window.clearInterval(this.timeInterval)
    this.timeInterval = null
  },
  methods: {
    UpdateTime () {
      let date = new Date()
      this.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
      this.time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
      switch (date.getDay()) {
        case 0: { this.week = '周日'; break }
        case 1: { this.week = '周一'; break }
        case 2: { this.week = '周二'; break }
        case 3: { this.week = '周三'; break }
        case 4: { this.week = '周四'; break }
        case 5: { this.week = '周五'; break }
        case 6: { this.week = '周六'; break }
        default: { this.week = '-'; break }
      }
      date = null
      return false
    }
  }
}
</script>

<style scoped>

</style>
