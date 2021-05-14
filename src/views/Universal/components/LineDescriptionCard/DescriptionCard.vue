<template>
  <div class="description-card-content">
    <div class="description-card-title">{{ title }}</div>
    <div class="description-card-value">{{ description }}</div>
  </div>
</template>

<script>
import './description-card.css'

export default {
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String }
  },
  name: 'DescriptionCard'
}
</script>

