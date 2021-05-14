<template>
  <div class="line-product-photo-content">
    <img :src="photoUrl" alt="#" />
  </div>
</template>

<script>
import './line-product-photo.css'

export default {
  props: {
    photoUrl: { default: '#', type: String }
  },
  name: 'LineProductPhoto'
}
</script>

<style scoped>

</style>