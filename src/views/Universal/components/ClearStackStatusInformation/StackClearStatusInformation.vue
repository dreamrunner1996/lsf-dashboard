<template>
  <div class="stack-clear-status-information-content">
    <div class="title">{{ title }}</div>
    <div class="status-content">
      <div class="status-item"
           :style="{ height: `calc(100% / ${statusList.length})` }"
           v-for="(statusItem, statusIndex) in statusList"
           :key="'stack-clear-status-item-' + statusIndex">
        <div class="title">
          <div class="title-ch">{{ statusItem.title }}</div>
          <div class="title-en">{{ statusItem.titleEn }}</div>
        </div>
        <div class="status" :style="{ color: PalletColorDisc(statusItem.value) }">
          {{ statusItem.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './stack-clear-status-information.css'

export default {
  name: 'StackClearStatusInformation',
  props: {
    title: { required: true, type: String },
    statusList: { required: true, type: Array }
  },
  methods: {
    PalletColorDisc: function (disc) {
      switch (disc) {
        case 0: return '#2352FE'
        case 10: return '#65AB7A'
        case 20: return '#BBAB00'
        default: return '#E818A3'
      }
    }
  }
}
</script>
