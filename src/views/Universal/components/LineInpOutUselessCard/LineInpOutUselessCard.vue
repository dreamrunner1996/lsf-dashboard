<template>
  <div class="line-inp-out-useless-card-content">
<!--    <div class="line-inp-out-useless-card-title-description">-->
<!--      <div class="line-inp-out-useless-card-title">{{ title }}</div>-->
<!--      <div class="line-inp-out-useless-card-description">{{ description }}</div>-->
<!--    </div>-->
    <div class="line-inp-out-useless-card-list">
      <div class="line-inp-out-useless-card-item">
        <div>目标产能</div>
        <div>{{ targetNum }}</div>
      </div>
      <div class="line-inp-out-useless-card-item">
        <div>实际产能</div>
        <div>{{ inputNum }}</div>
      </div>
<!--      <div class="line-inp-out-useless-card-item">-->
<!--        <div>投入产量</div>-->
<!--        <div>{{ inputNum }}</div>-->
<!--      </div>-->
      <div class="line-inp-out-useless-card-item">
        <div>合格数量</div>
        <div>{{ outputNum }}</div>
      </div>
<!--      <div class="line-inp-out-useless-card-item">-->
<!--        <div>不合格数量</div>-->
<!--        <div>{{ uselessNum }}</div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import './line-inp-out-useless-card.css'

export default {
  name: 'LineInpOutUselessCard',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    targetNum: { default: 0, type: Number },
    inputNum: { default: 0, type: Number },
    outputNum: { default: 0, type: Number },
    uselessNum: { default: 0, type: Number }
  }
}
</script>

<style scoped>

</style>
