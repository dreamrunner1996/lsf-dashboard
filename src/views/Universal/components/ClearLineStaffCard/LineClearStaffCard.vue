<template>
  <div class="line-clear-staff-card-content">
    <div class="staff-list">
      <div class="staff-item"
           v-for="item in showStaffList"
           :key="'staff-item-' + item.id">
        <div class="staff-item-img">
          <img :src="item.image" :alt="item.name" />
        </div>
        <div class="staff-item-information-content" >
          <div class="staff-item-name-title">
            <div class="staff-item-name">{{ item.name }}</div>
            <div class="divider" />
            <div class="staff-item-title">{{ item.titleStr }}</div>
          </div>
          <div class="staff-item-title-contact">
            <div class="staff-item-contact-title">联系方式</div>
            <div class="staff-item-contact">{{ item.contact }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './line-clear-staff-card.css'

export default {
  props: {
    staffData: { required: true, type: Array }
  },
  name: 'LineClearStaffCard',
  data: () => ({
    staffLength: 0,
    staffInterval: null,
    flashTime: 5000,
    showStaffList: [],
    showStaffListPage: 0
  }),
  mounted: function () {
    if (this.staffInterval) {
      window.clearInterval(this.staffInterval)
      this.staffInterval = null
    }
  },
  watch: {
    staffData: function () {
      if (this.staffData.length !== this.staffLength) {
        if (this.staffInterval) {
          window.clearInterval(this.staffInterval)
          this.staffInterval = null
        }
        this.staffLength = this.staffData.length
        this.showStaffList = []
        this.showStaffListPage = 0
        this.ChangeStaffList()
      }
    }
  },
  methods: {
    ChangeStaffList: function () {
      if (this.staffLength < 6) {
        // 不超过5个
        this.showStaffList.push(...this.staffData)
      } else {
        // 5个以上
        const staffPageNum = (this.staffLength / 5).toFixed(0) * 1
        let staffNum = 0
        this.showStaffList = []
        if ((this.showStaffListPage * 5 + 5) < this.staffLength) staffNum = 5
        else staffNum = this.staffLength - (this.showStaffListPage * 5)
        for (let i = this.showStaffListPage * 5; i < (this.showStaffListPage * 5) + staffNum; i++) {
          this.showStaffList.push(this.staffData[i])
        }
        this.showStaffListPage += 1

        if (this.showStaffListPage > staffPageNum) this.showStaffListPage = 0
        this.staffInterval = window.setInterval(() => {
          this.showStaffList = []
          if ((this.showStaffListPage * 5 + 5) < this.staffLength) staffNum = 5
          else staffNum = this.staffLength - (this.showStaffListPage * 5)
          for (let i = this.showStaffListPage * 5; i < (this.showStaffListPage * 5) + staffNum; i++) {
            this.showStaffList.push(this.staffData[i])
          }
          this.showStaffListPage += 1
          if (this.showStaffListPage > staffPageNum) this.showStaffListPage = 0
        }, this.flashTime)
      }
    }
  }
}
</script>

<style scoped>

</style>
