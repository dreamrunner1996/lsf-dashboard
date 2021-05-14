<template>
  <div class="line-finish-liquid-card-content">
<!--    <div class="line-finish-liquid-card-title-description">-->
<!--      <div class="line-finish-liquid-card-title">{{ title }}</div>-->
<!--      <div class="line-finish-liquid-card-description">{{ description }}</div>-->
<!--    </div>-->
    <div class="line-finish-liquid-card-liquid-content">
      <div class="line-finish-liquid1-content">
        <div class="line-finish-liquid1-title">{{ liquid1.title }}</div>
        <div class="line-finish-liquid1-description">{{ liquid1.description }}</div>
        <div class="line-finish-liquid1-canvas" :id="chartId1" />
      </div>
      <div class="line-finish-liquid2-content">
        <div class="line-finish-liquid2-title">{{ liquid2.title }}</div>
        <div class="line-finish-liquid2-description">{{ liquid2.description }}</div>
        <div class="line-finish-liquid2-canvas" :id="chartId2" />
      </div>
    </div>
  </div>
</template>

<script>
import { Liquid } from '@antv/g2plot'
import './line-finish-liquid-card.css'

export default {
  name: 'LineFinishLiquidCard',
  props: {
    title: { default: '', type: String },
    description: { default: '', type: String },
    chartId1: { required: true, type: String },
    chartId2: { required: true, type: String },
    liquid1: { default: () => ({}), type: Object },
    liquid2: { default: () => ({}), type: Object }
  },
  data: () => ({
    liquid1Canvas: null,
    liquid2Canvas: null
  }),
  watch: {
    'liquid1.value': function (newVal) {
      this.UpdateCanvas1(newVal)
    },
    'liquid2.value': function (newVal) {
      this.UpdateCanvas2(newVal)
    }
  },
  mounted: function () {
    this.CreateCanvas1(this.chartId1, this.liquid1.value)
    this.CreateCanvas2(this.chartId2, this.liquid2.value)
  },
  methods: {
    CreateCanvas1: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.liquid1Canvas = null
      }
      this.liquid1Canvas = new Liquid(chartId, {
        animation: false,
        statistic: {
          title: { formatter: () => '合格率', style: { fontSize: 16, fill: 'white' } },
          content: { style: { fontSize: 20, lineHeight: 1, fill: 'white' } }
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
      this.liquid1Canvas.render()
    },
    UpdateCanvas1: function (chartData) {
      this.liquid1Canvas.changeData(chartData)
    },
    CreateCanvas2: function (chartId, chartData) {
      if (document.getElementById(chartId).innerHTML) {
        document.getElementById(chartId).innerHTML = null
        this.liquid2Canvas = null
      }
      this.liquid2Canvas = new Liquid(chartId, {
        animation: false,
        statistic: {
          title: { formatter: () => '完成率', style: { fontSize: 16, fill: 'white' } },
          content: { style: { fontSize: 20, lineHeight: 1, fill: 'white' } }
        },
        liquidStyle: {
          fill: 'forestgreen',
          stroke: 'forestgreen'
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
      this.liquid2Canvas.render()
    },
    UpdateCanvas2: function (chartData) {
      this.liquid2Canvas.changeData(chartData)
    }
  }
}
</script>

<style scoped>

</style>
