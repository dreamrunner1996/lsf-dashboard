<template>
  <div class="select-content">
    <Card title="选择页面-跳转" style="width: 600px">
      <div style="text-align: center">
        <div style="text-align: left">URL地址:</div>
        <label title="地址">
          <Input v-model="$root.$data.store.devUrl" />
        </label>
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <div style="text-align: left">级联选择:</div>
        <Cascader style="width: 100%" :options="options" @change="SelectChange" />
      </div>
      <div style="text-align: center; margin-top: 10px">
        <div style="text-align: left">额外参数:</div>
        <div style="display: flex; flex-direction: row">
          <div style="height: 32px; line-height: 32px; width: 100px; text-align: left">configId: </div>
          <div style="margin-left: 20px; width: 430px">
            <label title="configId">
              <Input placeholder="configId" v-model="configId" />
            </label>
          </div>
        </div>
        <label title="palletStatus">
          <Input placeholder="palletStatus" v-model="palletStatus" />
          <Input placeholder="palletsReserve" v-model="palletsReserve" />
        </label>
      </div>
      <div v-if="showLinkTo" style="text-align: right; margin-top: 20px"><Button type="primary" @click="GotoLink">跳转</Button></div>
    </Card>
  </div>
</template>

<script>
import { Card, Cascader, Button, Input } from 'ant-design-vue'

import './select.css'

export default {
  name: 'Select',
  components: { Card, Cascader, Button, Input },
  data: () => ({
    showLinkTo: false,
    linkUrl: '',
    configId: 0,
    palletStatus: 'MdcPlc_3_StackPalletStatus',
    palletsReserve: 'MdcPlc_3_StackPalletsReserve',
    showParams: false,
    options: [
      {
        value: '比依(0072)',
        label: '比依(0072)',
        children: [{
          value: 'table',
          label: '表',
          children: [
            {value: 'Line_0072_1', label: '线头'}
          ]
        }]
      },
      {
        value: '比依(0082)',
        label: '比依(0082)',
        children: [{
          value: 'table', label: '表', children: [
            {value: 'Line_0082_1', label: '1线头'},
            {value: 'Line_0082_2', label: '2线头'}
          ]
        }, {
          value: 'stack', label: '码垛', children: [{value: 'Line_0082_3', label: '3线尾'}]
        }]
      },
      {
        value: '新宝(0091)',
        label: '新宝(0091)',
        children: [{
          value: 'XinBaoCT',
          label: '传统款',
          children: [
            { value: 'Line_Q3L5_CT_1', label: '1线线头' },
            { value: 'Line_Q3L5_CT_1-test', label: '1线线头-测试' },
            { value: 'Line_Q3L5_CT_1-w', label: '1线线尾' }
          ]
        }, {
          value: 'XinBaoYF',
          label: '研发款',
          children: [
            { value: 'Line_Q3L5_YF_1', label: '1线线头' },
            { value: 'Line_Q3L5_YF_1-w', label: '1线线尾' },
            { value: 'Line_Q3L5_YF_2', label: '2线线头' },
            { value: 'Line_Q3L5_YF_2-w', label: '2线线尾' }
          ]
        }, {
          value: 'XinBaoJP',
          label: '浸泡款',
          children: [
            { value: 'Line_Q3L5_JP_1', label: '1线线头' },
            { value: 'Line_Q3L5_JP_1-w', label: '1线线尾' },
            { value: 'Line_Q3L5_JP_2', label: '2线线头' },
            { value: 'Line_Q3L5_JP_2-w', label: '2线线尾' }
          ]
        }]
      },
      {
        value: '德昌(0095)',
        label: '德昌(0095)',
        children: [{
          value: 'DeChangItem',
          label: '线头',
          children: [
            {value: 'Line_0095_1', label: '1线'}
          ]
        }, {
          value: 'DeChangItem2',
          label: '线尾',
          children: [
            {value: 'Line_0095_1', label: '1线'}
          ]
        }]
      },
      {
        value: '通用(every)',
        label: '通用(every)',
        children: [
          {
            value: 'UniversalTable',
            label: '线体',
            children: [
              {value: 'UniversalTable', label: 'Go'}
            ]
          },
          {
            value: 'universalStack',
            label: '码垛',
            children: [
              {value: 'universalStack', label: 'Go'}
            ]
          }
        ]
      }
    ]
  }),
  mounted () {},
  methods: {
    SelectChange (value) {
      this.showParams = false
      console.log(value)
      if (value.length) {
        this.showLinkTo = true
        switch (value[1]) {
          case 'stack': this.showParams = true; break
          case 'XinBaoCT': {
            this.showParams = value[2] === 'Line_Q3L5_CT_1-w'
            break
          }
          case 'XinBaoYF': {
            if (value[2] === 'Line_Q3L5_YF_1-w' || value[2] === 'Line_Q3L5_YF_2-w') {
              this.showParams = true
            }
            break
          }
          case 'XinBaoJP': {
            if (value[2] === 'Line_Q3L5_JP_1-w' || value[2] === 'Line_Q3L5_JP_2-w') {
              this.showParams = true
            }
            break
          }
        }
        console.error(value)
        if (value[2].split('-w').length > 1) {
          this.linkUrl = `${value[1]}W?datasource=${value[2].split('-w')[0]}`
        } else if (value[2].split('-test').length > 1) {
          this.linkUrl = `${value[1]}T?datasource=${value[2]}&configId=${this.configId}`
        } else {
          this.linkUrl = `${value[1]}?datasource=${value[2]}`
        }
        console.error(this.linkUrl)
      } else {
        this.showLinkTo = false
        this.linkUrl = ''
      }
      console.log(this.linkUrl)
    },
    GotoLink () {
      let path = ''
      if (this.showParams) {
        path = `${this.linkUrl}&palletStatus=${this.palletStatus}&palletsReserve=${this.palletsReserve}`
      } else {
        path = this.linkUrl
      }
      this.$router.push({ path: path })
    }
  }
}
</script>

<style scoped>

</style>
