<template>
  <div class="universal-line-content">
    <div class="content-header">
      <!--   type: param data
             config.logoPath, config.title
      -->
      <img class="logo" id="logo" :src="logoPath" alt="#" />
      <div class="title">{{ title }}</div>
      <div class="date-time">
        <div class="date">{{ dateTime.date }}</div>
        <div class="week">{{ dateTime.week }}</div>
        <div class="time">{{ dateTime.time }}</div>
      </div>
    </div>
    <div class="content-body">
      <div class="content-body-left">
        <!--    订单信息、客户信息 卡片
                type: param data
                information ['orderCode', 'productModel', 'orderNum', 'productSpec', 'orderCustomer', 'productName', 'orderDestination']
        -->
        <OrderCustomInformationCard :order-custom-information-data="LineInformationData" />
        <!--    岗位信息 卡片
                type: param data
                staffList ['image', 'name', 'titleStr', 'contact']
        -->
        <StaffInformationCard :title="staffData.title" :staff-list="staffData.staff" />
        <!--    描述 卡片
                type: param data
                useless.description
        -->
        <DescriptionCard :title="descriptionCard.title" :description="descriptionCard.value" />
      </div>
      <div class="content-body-middle">
        <!--    产能详细表
                type: param data   ->   dataList
                type: data data    ->   dataList
        -->
<!--        <LineOutputTable :title="tableData.title"-->
<!--                         :description="tableData.description"-->
<!--                         :table-data="tableData.data" />-->
        <!--    当日目标与总产能趋势线图
                ant-g2plot Line
                type: param data   ->   dataList
                type: data daa     ->   dataList
        -->
        <LineOutputLine :title="lineData.title"
                        :description="lineData.description"
                        :chart-data="lineData.data"
                        chart-id="line-output-line" />
        <!--    当日各时段产能情况百分比柱状图
                ant-g2Plot Column
                type: param data   ->   dataList
                type: data data    ->   dataList
        -->
        <LineOutputColumn :title="columnData.title"
                          :description="columnData.description"
                          :chart-data="columnData.data"
                          chart-id="line-output-column" />
      </div>
      <div class="content-body-right">
        <LineProductPhoto />
        <!--    当日总数、输入、产出、不良信息卡片
                type: param data   ->   dataList[n].target
                type: data data    ->   dataList[n].productList
        -->
        <LineInpOutUselessCard :title="lineInpOutUselessData.title"
                               :description="lineInpOutUselessData.description"
                               :target-num="lineInpOutUselessData.data.target"
                               :input-num="lineInpOutUselessData.data.input"
                               :output-num="lineInpOutUselessData.data.output"
                               :useless-num="lineInpOutUselessData.data.useless" />
        <!--    产能情况水波图
                type: data data    ->   dataList[n].productList  (产出 合格 不良)
                type: param data   ->   dataList[n].target       (目标)
        -->
        <LineFinishLiquidCard chart-id1="pass-chart"
                              chart-id2="finish-chart"
                              :title="lineFinishLiquidData.title"
                              :description="lineFinishLiquidData.description"
                              :liquid1="lineFinishLiquidData.liquid1"
                              :liquid2="lineFinishLiquidData.liquid2" />
        <!--    当天考勤信息详细报表 饼图
                ant-g2plot Pie
                type: param data
                attendance ['all', 'normal', 'leave', 'absence']
        -->
        <LineAttendanceCard :title="attendanceData.title"
                            :description="attendanceData.description"
                            :chart-data="attendanceData.data"
                            chart-id="line-output-attendance" />
      </div>
    </div>
  </div>
</template>

<script>
import dateAndTime from '../mixins/DateAndTime'
import getAndDialogReadData from '../mixins/GetAndDialogReadData'
import ProductType from '../../../api/DialogReadData/productType'
import OrderCustomInformationCard from '../components/LineOrderCustomInformationCard/OrderCustomInformationCard'
import StaffInformationCard from '../components/LineStaffInformationCard/StaffInformationCard'
import DescriptionCard from '../components/LineDescriptionCard/DescriptionCard'
import LineOutputColumn from '../components/LineOutputColumn/LineOutputColumn'
import LineOutputLine from '../components/LineOutputLine/LineOutputLine'
import LineProductPhoto from '../components/LineProductPhoto/LineProductPhoto'
import LineAttendanceCard from '../components/LineAttendanceCard/LineAttendanceCard'
import LineInpOutUselessCard from '../components/LineInpOutUselessCard/LineInpOutUselessCard'
import LineFinishLiquidCard from '../components/LineFinishLiquidCard/LineFinishLiquidCard'
// import LineOutputTable from '../components/LineOutputTable/LineOutputTable'

import './universal-line.css'

export default {
  // 导入包
  mixins: [ dateAndTime, getAndDialogReadData ],
  components: {
    DescriptionCard,
    LineOutputColumn,
    LineOutputLine,
    LineProductPhoto,
    LineAttendanceCard,
    LineInpOutUselessCard,
    LineFinishLiquidCard,
    OrderCustomInformationCard,
    StaffInformationCard
  },
  name: 'UniversalLine',
  data: () => ({
    logoPath: '',
    title: '电子精益看板 (Dashboard)',
    LineInformationData: {},
    typeList: ['Null', 'SmallBox'],
    staffData: {
      title: '负责人名片',
      staff: [] // id, titleCh, titleEn, titleStr, name, contact, image
    },
    descriptionCard: {
      title: '描述',
      value: ''
    },
    columnData: {
      title: '各小时产能柱状图',
      description: '', // 当日各时段产能情况百分比柱状图
      data: [] // name, time, value, type
    },
    tableData: {
      title: '产能详细表',
      description: '',
      data: [] // id, time, target, input, output, useless, repair, finish
    },
    lineData: {
      title: '当日产能趋势图',
      description: '', // 当日目标与总产能趋势图
      data: [] // time, target, output
    },
    attendanceData: {
      title: '考勤信息',
      description: '', // 当天考勤信息详细报表
      data: []
    },
    lineInpOutUselessData: {
      title: '产线信息',
      description: '', // 当日产线总信息
      data: {}
    },
    lineFinishLiquidData: {
      title: '产能情况水波图',
      description: '', // 当日产能 完成率、合格率 水波图
      liquid1: { title: '产能合格率', description: '(合格 / (合格 + 不合格))', value: 0 },
      liquid2: { title: '目标完成率', description: '(合格 / 目标总和)', value: 0 }
    }
  }),
  mounted: function () {},
  beforeDestroy: function () {},
  methods: {
    // 处理 页面参数配置数据
    DialogParamData: function (paramRes) {
      const paramData = JSON.parse(JSON.stringify(paramRes))
      // title, image
      this.logoPath = paramData.config.logoPath
      this.title = paramData.config.title

      // orderCode, productModel, orderNum, productSpec, orderCustomer, productName, orderDestination
      this.LineInformationData.orderCode = paramData.information.orderCode
      this.LineInformationData.productModel = paramData.information.productModel
      this.LineInformationData.orderNum = paramData.information.orderNum
      this.LineInformationData.productSpec = paramData.information.productSpec
      this.LineInformationData.orderCustomer = paramData.information.orderCustomer
      this.LineInformationData.productName = paramData.information.productName
      // 刷新 DOM
      this.$set(this.LineInformationData, 'orderDestination', paramData.information.orderDestination)

      // staff
      this.staffData.staff = []
      function TitleStrCreate (titleCh, titleEn) {
        if (titleCh && !titleEn) return `${titleCh}`
        else if (titleCh && titleEn) return `${titleCh} (${titleEn})`
        else if (!titleCh && titleEn) return `${titleEn}`
        else return '-'
      }
      paramData.staffList.forEach(staffRes => {
        this.staffData.staff.push({
          ...staffRes,
          titleStr: TitleStrCreate(staffRes.titleCh, staffRes.titleEn)
        })
      })

      // description
      this.descriptionCard.value = paramData.useless.description

      // dataList (时间配置)  --  id, timeStr, startTime, endTime, target
      this.columnData.data = [] // ...paramDataListRes, name, time, value, type
      this.tableData.data = []  // ...paramDataListRes, id, time, target, input, output, useless, repair, finish
      this.lineData.data = []   // ...paramDataListRes, time, target, output
      this.lineInpOutUselessData.data = { target: 0, input: 0, output: 0, useless: 0 }
      paramData.dataList.forEach(paramDataListRes => {
        this.columnData.data.push(
          { ...paramDataListRes, name: '目标', typeEn: 'target', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : paramDataListRes.target, type: '目标产能' },
          { ...paramDataListRes, name: '投入', typeEn: 'input', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '投入数量' },
          { ...paramDataListRes, name: '产出', typeEn: 'output', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '合格' },
          { ...paramDataListRes, name: '产出', typeEn: 'useless', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '不良' },
          { ...paramDataListRes, name: '产出', typeEn: 'repair', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '维修' }
        )
        this.tableData.data.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          target: paramDataListRes.offsetDay === null ? null : paramDataListRes.target,
          input: paramDataListRes.offsetDay === null ? null : 0,
          output: paramDataListRes.offsetDay === null ? null : 0,
          useless: paramDataListRes.offsetDay === null ? null : 0,
          repair: paramDataListRes.offsetDay === null ? null : 0,
          finish: paramDataListRes.offsetDay === null ? null : '0%'
        })
        this.lineData.data.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          target: paramDataListRes.offsetDay === null ? null : paramDataListRes.target,
          output: paramDataListRes.offsetDay === null ? null : 0
        })
        this.lineInpOutUselessData.data.target += paramDataListRes.target
      })

      // attendance
      this.attendanceData.data = []
      Object.keys(paramData.attendance).forEach(attendanceRes => {
        switch (attendanceRes) {
          case 'absence': this.attendanceData.data.push({ type: '缺席', value: paramData.attendance[attendanceRes] }); break
          // case 'all': this.attendanceData.data.push({ type: '总数', value: paramData.attendance[attendanceRes] }); break
          case 'leave': this.attendanceData.data.push({ type: '请假', value: paramData.attendance[attendanceRes] }); break
          case 'normal': this.attendanceData.data.push({ type: '出席', value: paramData.attendance[attendanceRes] }); break
          // default: this.attendanceData.data.push({ type: attendanceRes, value: paramData.attendance[attendanceRes] }); break
        }
      })
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      dataData.dataList.forEach(dataDataListRes => {
        const dtObj = ProductType(dataDataListRes.productList, this.typeList)
        this.columnData.data.forEach(columnDataRes => {
          if (dataDataListRes.startTime.timeStamp === columnDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === columnDataRes.endTime.timeStamp) {
            switch (columnDataRes.typeEn) {
              case 'input': columnDataRes.value += dtObj.input; break
              case 'output': columnDataRes.value += dtObj.ok; break
              case 'useless': columnDataRes.value += dtObj.ng; break
              case 'repair': columnDataRes.value += dtObj.repair; break
              default: break
            }
          }
        })

        this.tableData.data.forEach(tableDataRes => {
          if (dataDataListRes.startTime.timeStamp === tableDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === tableDataRes.endTime.timeStamp) {
            tableDataRes.input += dtObj.input
            tableDataRes.output += dtObj.ok
            tableDataRes.useless += dtObj.ng
            tableDataRes.repair += dtObj.repair
            if (tableDataRes.target === 0 || tableDataRes.output === 0) tableDataRes.finish = 0 + '%'
            else if (tableDataRes.target < tableDataRes.output) tableDataRes.finish = 100 + '%'
            else tableDataRes.finish = ((tableDataRes.output / tableDataRes.target) * 100).toFixed(1) * 1 + '%'

            this.lineInpOutUselessData.data.useless += dtObj.ng
            this.lineInpOutUselessData.data.output += dtObj.ok
            this.lineInpOutUselessData.data.input += dtObj.input
          }
        })

        this.lineData.data.forEach(lineDataRes => {
          if (dataDataListRes.startTime.timeStamp === lineDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === lineDataRes.endTime.timeStamp) {
            lineDataRes.output += dtObj.ok
          }
        })
      })
      const liquid1Value = this.lineInpOutUselessData.data.output === 0 ? 0 : (this.lineInpOutUselessData.data.output / (this.lineInpOutUselessData.data.output + this.lineInpOutUselessData.data.useless)).toFixed(4) * 1
      const liquid2Value = this.lineInpOutUselessData.data.target === 0 ? 0 : this.lineInpOutUselessData.data.output / this.lineInpOutUselessData.data.target
      this.$set(this.lineFinishLiquidData.liquid1, 'value', liquid1Value)
      this.$set(this.lineFinishLiquidData.liquid2, 'value', liquid2Value)
    },
    // 处理 模拟信息
    // DialogSimulateData: function (simulateRes) {},
    // 处理 children信息
    DialogChildrenData: function (childrenData) {
      if (childrenData.length) {
        childrenData.forEach(childrenDataItem => {
          this.DialogDataData(childrenDataItem['dataList'])
          this.DialogChildrenData(childrenDataItem['children'])
        })
      }
    }
  }
}
</script>
