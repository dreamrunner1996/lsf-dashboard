<template>
  <div class="staff-information-card-content">
    <div class="staff-information-card-title">
      {{ title }}
    </div>
    <div class="staff-information-card-list" id="staff-information-card-list">
      <div class="staff-information-card-context" id="staff-information-card-context">
        <div class="staff-information-card-item"
             v-for="staffItem in staffList"
             :key="'staff-card-item-' + staffItem.id">
          <div class="staff-information-card-item-image">
            <img :src="staffItem.image ? staffItem.image : defaultStaffImg" :alt="'staffList-item-' + staffItem.id" />
          </div>
          <div class="staff-information-card-item-information">
            <div class="staff-information-card-item-information-name">{{ staffItem.name }}</div>
            <div class="staff-information-card-item-information-staff">{{ staffItem.titleStr }}</div>
            <div class="staff-information-card-item-information-phone">{{ staffItem.contact }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './staff-infomation-card.css'
const defaultStaffImg = require('@/assets/staff-img.png')

export default {
  name: 'StaffInformationCard',
  props: {
    title: { default: '', type: String },
    staffList: { default: () => ([]), type: Array, required: true }
  },
  data: () => ({
    intervalList: { staffInformation: null },
    staffListLength: 0,
    defaultStaffImg
  }),
  watch: {
    // staffList: function (newVal) {
    //   if ((newVal.length > 6) && (this.staffListLength !== newVal.length)) {
    //     this.staffListLength = newVal.length
    //     this.$nextTick(() => {
    //       this.StaffListRoll(1500)
    //     })
    //   }
    // }
  },
  methods: {
    // StaffListRoll: function (awaitMs = 3000) {
    //   const cardList = document.getElementById('staff-information-card-list')
    //   const cardContext = document.getElementById('staff-information-card-context')
    //
    //   if (this.intervalList.staffInformation) {
    //     window.clearInterval(this.intervalList.staffInformation)
    //     this.intervalList.staffInformation = null
    //   }
    //   const wait = (ms) => new Promise((resolve) => {
    //     window.setTimeout(() => {
    //       resolve()
    //     }, ms)
    //   })
    //   let bottomStatus = false
    //   const bottomMaxVal = cardContext.scrollHeight - 300
    //   window.setInterval(async () => {
    //     if (cardList.scrollTop <= 0) {
    //       await wait(awaitMs)
    //       bottomStatus = false
    //     }
    //     if ((cardList.scrollTop < bottomMaxVal) && !bottomStatus) cardList.scrollTop++
    //     else if (cardList.scrollTop >= bottomMaxVal) {
    //       await wait(awaitMs)
    //       bottomStatus = true
    //     }
    //     if (bottomStatus) cardList.scrollTop--
    //   }, 30)
    // }
  }
}
</script>
