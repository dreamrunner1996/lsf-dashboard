<template>
  <div class="line-output-table-content">
    <div class="line-output-table-title-description">
      <div class="line-output-table-title">{{ title }}<span style="color: #141414">.</span></div>
      <div class="line-output-table-description">{{ description }}</div>
    </div>
    <div class="line-output-table-table">
      <table>
        <tr :style="{ color: color[0] ? color[0] : '#FFFFFF' }">
          <th style="opacity: 0">.</th>
          <th v-for="tableDataItem in tableData" :key="'table-item-time-' + tableDataItem.id">{{ tableDataItem.time }}</th>
        </tr>
        <tr :style="{ color: color[1] ? color[1] : '#FFFFFF' }">
          <td>目标</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-target-' + tableDataItem.id">{{ tableDataItem.target }}</td>
        </tr>
        <tr :style="{ color: color[2] ? color[2] : '#FFFFFF' }">
          <td>投入</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-input-' + tableDataItem.id">{{ tableDataItem.input }}</td>
        </tr>
        <tr :style="{ color: color[3] ? color[3] : '#FFFFFF' }">
          <td>合格</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-output-' + tableDataItem.id">{{ tableDataItem.output }}</td>
        </tr>
        <tr :style="{ color: color[4] ? color[4] : '#FFFFFF' }">
          <td>不良</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-useless-' + tableDataItem.id">{{ tableDataItem.useless }}</td>
        </tr>
        <tr :style="{ color: color[5] ? color[5] : '#FFFFFF' }">
          <td>维修</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-repair-' + tableDataItem.id">{{ tableDataItem.repair }}</td>
        </tr>
        <tr :style="{ color: color[6] ? color[6] : '#FFFFFF' }">
          <td>完成率</td>
          <td v-for="tableDataItem in tableData" :key="'table-item-finish-' + tableDataItem.id">{{ tableDataItem.finish }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import './line-output-table.css'

export default {
  props: {
    title: { default: '-', type: String },
    description: { default: '', type: String },
    tableData: { required: true, type: Array },
    color: { default: () => (['pink', '#F830FF', '#F2AE4C', '#3AFF2C', '#FF7575', '#EBFE30', 'skyblue']), type: Array }
  },
  name: 'LineOutputTable'
}
</script>

<style scoped>

</style>
