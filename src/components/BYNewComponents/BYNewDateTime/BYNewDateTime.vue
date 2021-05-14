<template>
  <div class="by-new-date-time-content">
    <div class="date-week">
      {{ date }}, {{ week }}
    </div>
    <div class="time">
      {{ time }}
    </div>
  </div>
</template>

<script>
import './by-new-date-time.css'

export default {
  name: 'BYNewDateTime',
  data: () => ({
    cInterval: { time: null },
    date: '',
    week: '',
    time: ''
  }),
  mounted () {
    console.warn('components -> BYNewDateTime -> mounted')
    this.UpdateTime()
    if (this.cInterval.time) {
      window.clearInterval(this.cInterval.time)
      this.cInterval.time = null
    }
    this.cInterval.time = window.setInterval(this.UpdateTime, 1000)
  },
  beforeDestroy () {
    console.warn('components -> BYNewDateTime -> beforeDestroy')
    if (this.cInterval.time) {
      window.clearInterval(this.cInterval.time)
      this.cInterval.time = null
    }
  },
  methods: {
    UpdateTime: function () {
      console.log('components -> BYNewDateTime -> methods -> UpdateTime')
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
    }
  }
}
</script>

<style scoped>

</style>
