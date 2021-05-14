<template>
  <div class="by-new-porcelain-content"
       :style="{ ...otherStyle, width: col ? `${col*192}px` : '192px', backgroundColor: color }">
    <div class="by-new-porcelain-information-ch">{{ keyCh }}</div>
    <div class="by-new-porcelain-information-en">{{ keyEn }}</div>
    <div class="by-new-porcelain-information-val">{{ value }}</div>
  </div>
</template>

<script>
import './by-new-porcelain.css'

export default {
  name: 'BYNewPorcelain',
  props: {
    otherStyle: { default: () => ({}), type: Object },
    col: { default: 1, type: Number },
    color: { default: '#6F6FD9', type: String },
    keyCh: { default: '-', type: String },
    keyEn: { default: '-', type: String },
    value: { default: '-' }
  },
  data: () => ({}),
  mounted: function () {
    console.warn('components -> BYNewComponents.BYNewPorcelain -> mounted')
  }
}
</script>

<style scoped>

</style>
