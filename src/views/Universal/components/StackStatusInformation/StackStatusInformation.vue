<template>
  <div class="stack-status-information-content">
    <div class="stack-status-information-title-description">
      <div class="stack-status-information-title">{{ title }}</div>
      <div class="stack-status-information-description">{{ description }}</div>
    </div>
    <div class="stack-status-information-card">
      <div v-for="(cardDataVal, cardDataIndex) in cardData"
           class="stack-status-information-card-item"
           :style="{ height: `${ (780 - 20 * (cardData.length)) / cardData.length }px` }"
           :key="`card-data-${cardDataIndex}`">
        <div class="stack-status-information-card-item-title-ch">{{ cardDataVal.ch }}</div>
        <div class="stack-status-information-card-item-title-en">{{ cardDataVal.en }}</div>
        <div class="stack-status-information-card-item-title-value"
             :style="{ color: PalletColorDisc(cardDataVal.value) }">{{ cardDataVal.status }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import './stack-status-information.css'

export default {
  name: 'StackStatusInformation',
  props: {
    title: { default: '-', type: String },
    description: { default: '-', type: String },
    cardData: { default: () => ([]), type: Array }
  },
  filters: {
  },
  methods: {
    PalletColorDisc: function (disc) {
      switch (disc) {
        case 0: return '#FFFFFF'
        case 10: return '#65FF7A'
        case 20: return '#FFEF00'
        default: return '#E818A3'
      }
    }
  }
}
</script>

<style scoped>

</style>
