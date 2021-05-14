<template>
  <div class="stack-product-information-card-content">
    <div class="stack-product-information-card-title-description">
      <div class="stack-product-information-card-title">{{ title }}</div>
      <div class="stack-product-information-card-description">{{ description }}</div>
    </div>
    <div class="stack-product-information-card-information-content">
      <div class="stack-product-information-card-information-item"
           v-for="informationItem in informationList"
           :key="'information-item-' + informationItem.title">
        <div class="stack-product-information-card-information-item-title">{{ informationItem.title }}</div>
        <div class="stack-product-information-card-information-item-value">{{ informationItem.value }}</div>
      </div>
    </div>
    <div class="stack-product-information-card-information-canvas" :id="chartId" />
  </div>
</template>

<script>
import './stack-product-information-card.css'
import { Liquid } from '@antv/g2plot'

export default {
  name: 'StackProductInformationCard',
  props: {
    chartId: { required: true, type: String },
    chartData: { required: true, type: Number },
    informationList: { required: true, type: Array },
    title: { default: '', type: String },
    description: { default: '', type: String }
  },
  data: () => ({
    liquidCanvas: null
  }),
  watch: {
    chartData: function (newVal) {
      this.UpdateCanvas(newVal)
    }
  },
  mounted: function () {
    this.CreateCanvas(this.chartId, this.chartData)
  },
  methods: {
    CreateCanvas: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.liquidCanvas = null
      }
      this.liquidCanvas = new Liquid(chartId, {
        animation: false,
        statistic: {
          title: { formatter: () => '与上一时段对比', style: { fontSize: 16, fill: 'white' } },
          content: { style: { fontSize: 24, lineHeight: 1, fill: 'white' } }
        },
        liquidStyle: {
          fill: 'dodgerblue',
          stroke: 'dodgerblue'
        },
        percent: chartData,
        outline: {
          border: 4,
          distance: 8
        },
        wave: {
          length: 128
        }
      })
      this.liquidCanvas.render()
    },
    UpdateCanvas: function (chartData) {
      this.liquidCanvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
