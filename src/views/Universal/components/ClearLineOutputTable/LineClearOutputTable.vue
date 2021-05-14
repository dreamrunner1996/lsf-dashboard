<template>
  <div class="line-clear-output-table-content">
    <table>
      <tr v-for="(tableColumnItem, tableColumnIndex) in tableColumn" :key="'line-clear-output-table-' + tableColumnItem">
        <td>{{ tableColumnItem }}</td>
        <td v-for="(tableDataItem, tableDataIndex) in tableData"
            :key="'line-clear-output-table-item-' + tableKey[tableColumnIndex] + '-' + tableDataIndex">
          {{ tableDataItem[tableKey[tableColumnIndex]] }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import './line-clear-output-table.css'

export default {
  props: {
    tableColumn: { required: true, type: Array },
    tableKey: { required: true, type: Array },
    tableData: { required: true, type: Array }
  },
  name: 'LineClearOutputTable'
}
</script>
