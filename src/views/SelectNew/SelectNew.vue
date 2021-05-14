<template>
  <div class="select-new-content">
    <Card title="选择页面-跳转" style="width: 600px">
      <div style="text-align: center">
        <div style="text-align: left">URL地址:</div>
        <label title="地址">
          <Input v-model="$root.$data.store.devUrl" />
        </label>
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <div style="text-align: left">显示方式:</div>
        <Cascader style="width: 100%" :defaultValue="[displayOptions[0].value]" :options="displayOptions" @change="SelectDisplay" />
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <div style="text-align: left">样式选择:</div>
        <Cascader style="width: 100%" :options="options" @change="SelectChange" />
      </div>
      <div style="text-align: center; margin-top: 10px">
        <div style="text-align: left">额外参数: </div>
        <div style="margin-top: 10px;">
          <div>
            <div style="text-align: right; margin-right: 10px;">configId</div>
            <div>
              <label title="configId">
                <Input placeholder="configId 参数" v-model="configId" />
              </label>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div style="text-align: right; margin-right: 10px;">optional</div>
            <div>
              <label title="optional">
                <Select mode="multiple" style="width: 100%" placeholder="optional 参数" @change="optionalChange">
                  <SelectOption v-for="optionalItem in optional" :key="'optional-'+optionalItem" :value="optionalItem">
                    {{ optionalItem }}
                  </SelectOption>
                </Select>
              </label>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <div style="text-align: right; margin-right: 10px;">protocolNames</div>
            <div v-if="protocolNames.length"
                 style="text-align: left; color: #2f54eb; cursor: pointer; text-decoration: underline; width: 60px"
                 @click="AddProtocolNames">添加参数</div>
            <div v-if="protocolNames.length" style="max-height: 200px; overflow-y: auto">
              <div v-for="(protocolNamesItem, protocolNamesIndex) in protocolNames"
                   :key="'protocolNamesItem-' + protocolNamesIndex"
                   style="display: flex; flex-direction: row; margin-top: 5px;">
                <div style="width: calc(100% - 42px); margin-right: 10px;">
                  <label :title="'protocolNames-'+protocolNamesIndex">
                    <Input placeholder="protocolNames 参数" v-model="protocolNames[protocolNamesIndex]" />
                  </label>
                </div>
                <div style="width: 32px; height: 32px; line-height: 32px; color: red; font-size: 30px; cursor: pointer" @click="DeleteProtocolNames(protocolNamesItem, protocolNamesIndex)">
                  ×
                </div>
              </div>
            </div>
            <div v-else
                 @click="AddProtocolNames"
                 style="width: 100%; height: 80px; cursor: pointer; box-sizing: border-box; border: 2px solid #bababa; color: #bababa; display: flex; flex-direction: column; justify-content: center; align-items: center;">
              <div style="font-size: 1.6em">添加参数</div>
            </div>
          </div>
          <div style="margin-top: 10px">
            <div style="text-align: right; margin-right: 10px;">produceSize</div>
            <div>
              <label title="produceSize">
                <Input placeholder="produceSize 参数" v-model="produceSize" />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="show-url" style="margin-top: 10px; text-align: left">
        <div>跳转url</div>
        <div style="word-break: break-all; color: #2f54eb; text-decoration: underline">{{ allUrl }}</div>
      </div>
      <div style="text-align: right; margin-top: 20px"><Button type="primary" @click="GotoLink">跳转</Button></div>
    </Card>
  </div>
</template>

<script>
import './select-new.css'
import { Card, Cascader, Button, Input, Select } from 'ant-design-vue'
const SelectOption = Select.Option
// import {} from '@ant-design'

export default {
  name: 'SelectNew',
  components: { Card, Cascader, Button, Input, Select, SelectOption },
  data: () => ({
    configId: null,
    optional: ['children', 'data', 'produce', 'mock', 'protocol'],
    pageUrl: '',
    optionalSelect: [],
    protocolNames: [],
    produceSize: null,
    displayOptions: [
      { value: 'all', label: '全部（all）' },
      { value: 'self', label: '自身（self）' },
      { value: 'children', label: '子（children）' }
    ],
    displayVal: 'all',
    options: [
      { value: 'bi-yi', label: '比依(new)', children: [
        { value: 'line', label: '线体' },
        { value: 'stack', label: '码垛' }
      ]},
      { value: 'xin-bao', label: '新宝(0091)', children: [
        { value: 'all', label: '汇总' },
        { value: 'line', label: '线体' },
        { value: 'stack', label: '码垛' }
      ]},
      {value: 'hand-to-hand', label: '抓啦抓(SLS)', children: [
        { value: 'line', label: '线体' }
      ]},
      { value: 'universal', label: '通用(universal)', children: [
        { value: 'line', label: '线体' },
        { value: 'stack', label: '码垛' },
        { value: 'line-clear', label: '线体-简' },
        { value: 'stack-clear', label: '码垛-简' }
      ]}
    ]
  }),
  computed: {
    allUrl: function () {
      let optionalStr = ''
      this.optionalSelect.forEach(optionalRes => {
        optionalStr += `optional=${optionalRes}&`
      })
      let protocolStr = ''
      if (this.protocolNames.length) {
        this.protocolNames.forEach(protocolRes => {
          protocolStr += `protocolNames=${protocolRes}&`
        })
      }
      let produceSizeStr = ''
      if (this.produceSize) { produceSizeStr = `produceSize=${this.produceSize}` }
      return `${this.pageUrl}?dataDisplay=${this.displayVal}&configId=${this.configId}&${optionalStr}${protocolStr}${produceSizeStr}`
    }
  },
  methods: {
    optionalChange: function (optionalArray) {
      this.optionalSelect = JSON.parse(JSON.stringify(optionalArray))
    },
    DeleteProtocolNames: function (protocolNamesItem, protocolNamesVal) {
      this.$delete(this.protocolNames, protocolNamesVal)
    },
    SelectDisplay: function (selectArray) {
      this.displayVal = selectArray[0]
    },
    SelectChange: function (selectArray) {
      if (selectArray[0] === 'xin-bao') {
        if (selectArray[1] === 'all') this.pageUrl = 'XinBaoAll'
        if (selectArray[1] === 'line') this.pageUrl = 'XinBaoLine'
        if (selectArray[1] === 'stack') this.pageUrl = 'XinBaoStack'
      }
      if (selectArray[0] === 'universal') {
        if (selectArray[1] === 'line') this.pageUrl = 'UniversalLine'
        if (selectArray[1] === 'stack') this.pageUrl = 'UniversalStack'
        if (selectArray[1] === 'line-clear') this.pageUrl = 'UniversalLineClear'
        if (selectArray[1] === 'stack-clear') this.pageUrl = 'UniversalStackClear'
      }
      if (selectArray[0] === 'hand-to-hand') {
        if (selectArray[1] === 'line') this.pageUrl = 'SLSLine'
      }
      if (selectArray[0] === 'bi-yi') {
        if (selectArray[1] === 'line') this.pageUrl = 'BiYiLine'
        if (selectArray[1] === 'stack') this.pageUrl = 'BiYiStack'
      }
    },
    AddProtocolNames: function () {
      this.protocolNames.push('')
    },
    showLinkTo: function () {},
    GotoLink: function () {
      this.$router.push({ path: this.allUrl })
    }
  }
}
</script>

<style scoped>

</style>
