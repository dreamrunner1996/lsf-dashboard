<template>
  <div class="sls-line-content">
    <!--  头部内容 - logo, 标题, 时间  -->
    <div class="content-header">
      <!--   logo   -->
      <div class="logo-content">
        <img id="logo" :src="logoPath" alt="#" />
      </div>
      <!--   标题   -->
      <div class="title-content">
        <div class="title-border-img-content">
          <img id="title-border" src="./img/title-border.png" alt="#" >
        </div>
        <div id="title-context">{{ title }}</div>
      </div>
      <!--   日期与时间   -->
      <div class="time-date-content">
        <div id="time-context">{{ lunarDateTime.time }}</div>
        <div class="date-week-context">
          <div id="date-context">{{ lunarDateTime.date }}</div>
          <div id="week-old-date-context">{{ lunarDateTime.week }} {{ lunarDateTime.lunarDate }}</div>
        </div>
      </div>
    </div>
    <!--  其它所有内容  -->
    <div class="content-body">
      <!--   左栏目   -->
      <div class="content-body-left">
        <!--    订单号    -->
        <div class="show-item order-code-content">
          <div class="title-value-context">
            <div class="title-context">订单号</div>
            <div class="value-context">{{ lineInformationData.orderCode }}</div>
          </div>
        </div>
        <!--    客户    -->
        <div class="show-item order-custom-content">
          <div class="title-value-context">
            <div class="title-context">客户</div>
            <div class="value-context">{{ lineInformationData.orderCustom }}</div>
          </div>
        </div>
        <!--    产品型号    -->
        <div class="show-item order-product-model-content">
          <div class="title-value-context">
            <div class="title-context">产品型号</div>
            <div class="value-context">{{ lineInformationData.productModel }}</div>
          </div>
        </div>
        <!--    产品图片    -->
        <div class="show-item order-product-photo-content">
          <div class="title-value-context">
            <div class="title-context">产品图片</div>
            <div class="value-context" />
          </div>
          <div class="photo-content">
            <img id="order-photo"
                 :src="lineInformationData.productImage ? lineInformationData.productImage : image.orderPhoto404"
                 alt="#" />
          </div>
        </div>
        <!--    产品计划排产    -->
        <div class="show-item order-plan-content">
          <div class="title-value-context">
            <div class="title-context">产品计划排产</div>
            <div class="value-context">{{ lineInformationData.productPlanOutput }}</div>
          </div>
        </div>
        <!--    负责人名片    -->
        <div class="show-item order-staff-card-content">
          <div class="title-value-context">
            <div class="title-context">{{ staffData.title }}</div>
            <div class="value-context" />
          </div>
          <div class="staff-card-content">
            <div class="staff-card-list">
              <div class="staff-card-item"
                   v-for="staffItem in staffData.staffList"
                   :key="'staff-card-item-' + staffItem.id">
                <div class="staff-card-item-logo-content">
                  <img class="staff-worker-logo"
                       :src="staffItem.image ? staffItem.image : image.staffDefault"
                       :alt="'staff-card-item-image-' + staffItem.id" />
                </div>
                <div class="staff-card-item-info-content">
                  <div class="staff-card-item-info-name-worker-content">
                    <div class="staff-card-item-info-name">{{ staffItem.name }}</div>
                    <div class="staff-card-item-info-worker">{{ staffItem.titleStr }}</div>
                  </div>
                  <div class="staff-card-item-info-phone-content">
                    <img class="staff-phone" src="./img/staff-phone.png" alt="#" />
                    <div class="staff-phone-context">{{ staffItem.contact }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--   中间栏目   -->
      <div class="content-body-middle">
        <!--    产能趋势图    -->
        <div class="g2-output-line-content">
          <div class="title-content">
            <div class="title-context">{{ lineData.title }}</div>
            <div class="title-context-foot-image">
              <img src="./img/canvas-title.png" alt="#" />
            </div>
          </div>
          <div class="canvas-content">
<!--            <SLSLineOutputWaterfall :chart-data="waterfallData.data" chart-id="g2-output-waterfall-canvas" />-->
            <SLSLineOutputLine :chart-data="lineData.data" chart-id="g2-output-line-canvas" />
          </div>
        </div>
        <!--    当日各时段产能情况    -->
        <div class="g2-all-column-content">
          <div class="title-content">
            <div class="title-context">{{ columnData.title }}</div>
            <div class="title-context-foot-image">
              <img src="./img/canvas-title.png" alt="#" />
            </div>
          </div>
          <div class="canvas-content">
            <SLSLineAllColumn :chart-data="columnData.data" chart-id="g2-all-column-canvas" />
          </div>
        </div>
      </div>
      <!--   右栏目   -->
      <div class="content-body-right">
        <!--    产能信息    -->
        <div class="show-item product-information-card-content">
          <div class="title-value-context">
            <div class="title-context">{{ lineOutputData.title }}</div>
            <div class="value-context" />
          </div>
          <div class="product-information-content">
            <!--      投入产能      -->
            <div class="product-information-item product-info-standard">
              <div class="product-information-item-logo-title-content">
                <img class="product-info-item-logo" :src="image.infoStandard" alt="#" />
                <div class="product-info-item-title">投入产能</div>
              </div>
              <div class="product-info-item-value">{{ lineOutputData.data.input }}</div>
            </div>
            <!--      合格数量      -->
            <div class="product-information-item product-info-qualified">
              <div class="product-information-item-logo-title-content">
                <img class="product-info-item-logo" :src="image.infoQualified" alt="#" />
                <div class="product-info-item-title">合格数量</div>
              </div>
              <div class="product-info-item-value">{{ lineOutputData.data.ok }}</div>
            </div>
            <!--      不良数量      -->
            <div class="product-information-item product-info-useless">
              <div class="product-information-item-logo-title-content">
                <img class="product-info-item-logo" :src="image.infoUseless" alt="#" />
                <div class="product-info-item-title">不良数量</div>
              </div>
              <div class="product-info-item-value">{{ lineOutputData.data.useless }}</div>
            </div>
          </div>
        </div>
        <!--    考勤信息    -->
        <div class="show-item attendance-card-content">
          <div class="title-value-context">
            <div class="title-context">{{ attendanceData.title }}</div>
            <div class="value-context" />
          </div>
          <div class="attendance-content">
            <!--      出勤人数      -->
            <div class="attendance-item">
              <div class="attendance-item-value attendance-worker">{{ attendanceData.data.worker }}</div>
              <div class="attendance-item-title">出勤人数</div>
            </div>
            <!--      请假人数      -->
            <div class="attendance-item">
              <div class="attendance-item-value attendance-leave">{{ attendanceData.data.leave }}</div>
              <div class="attendance-item-title">请假人数</div>
            </div>
            <!--      矿工人数      -->
            <div class="attendance-item">
              <div class="attendance-item-value attendance-absence">{{ attendanceData.data.absence }}</div>
              <div class="attendance-item-title">矿工人数</div>
            </div>
          </div>
        </div>
        <!--    通知栏    -->
        <div class="show-item notify-card-content">
          <div class="title-value-context">
            <div class="title-context">{{ notifyCard.title }}</div>
            <div class="value-context" />
          </div>
          <div class="notify-content">
            <pre id="notify-context">{{ notifyCard.value }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lunarDateAndTime from '../../Universal/mixins/LunarDateAndTime'
import getAndDialogReadData from '../../Universal/mixins/GetAndDialogReadData'
import ProductType from '../../../api/DialogReadData/productType'
import SLSLineAllColumn from '../components/SLSLineAllColumn/SLSLineAllColumn'
import SLSLineOutputLine from '../components/SLSLineOutputLine/SLSLineOutputLine'
// import SLSLineOutputWaterfall from '../components/SLSLineOutputWaterfall/SLSLineOutputWaterfall'
import './sls-line.css'

const orderPhoto404 = require('./img/order-photo-404.png')
const staffDefault = require('./img/staff-default.png')
const infoStandard = require('./img/info-standard.png')
const infoReality = require('./img/info-reality.png')
const infoQualified = require('./img/info-qualified.png')
const infoUseless = require('./img/info-useless.png')

export default {
  // 导入包
  mixins: [ lunarDateAndTime, getAndDialogReadData ],
  components: { SLSLineAllColumn, SLSLineOutputLine },
  name: 'SLSLine',
  data: () => ({
    image: {
      orderPhoto404,
      staffDefault,
      infoStandard,
      infoReality,
      infoQualified,
      infoUseless
    },
    logoPath: '',
    title: 'AF项目部总装车间3线',
    lineInformationData: {
      orderCode: '订单号',
      orderCustom: '客户',
      productModel: '产品型号',
      productImage: null,
      productPlanOutput: 0
    },
    typeList: ['Null', 'SmallBox'],
    staffData: {
      title: '负责人名片',
      staffList: [] // id, titleCh, titleEn, titleStr, name, contact, image
    },
    waterfallData: {
      title: '产能趋势瀑布图',
      data: [] // time, target, output
    },
    lineData: {
      title: '产能趋势图',
      data: [] // time, target, output
    },
    columnData: {
      title: '当日各时段产能情况',
      data: [] // name, time, value, type
    },
    lineOutputData: {
      title: '产能信息',
      data: {
        input: 0,
        ok: 0,
        useless: 0
      }
    },
    attendanceData: {
      title: '考勤信息',
      data: {
        worker: 0,
        leave: 0,
        absence: 0
      }
    },
    notifyCard: {
      title: '通知栏',
      value: ''
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
      // 订单号, 客户, 产品型号, 产品图片
      this.lineInformationData.orderCode = paramData.information.orderCode
      this.lineInformationData.orderCustom = paramData.information.orderCustomer
      this.lineInformationData.productModel = paramData.information.productModel
      this.lineInformationData.productImage = paramData.information.productImage
      this.$set(this.lineInformationData, 'productPlanOutput', 0)
      // staff 负责人名片
      this.staffData.staffList = []
      function TitleStrCreate (titleCh, titleEn) {
        if (titleCh && !titleEn) return `${titleCh}`
        else if (titleCh && titleEn) return `${titleCh} (${titleEn})`
        else if (!titleCh && titleEn) return `${titleEn}`
        else return '-'
      }
      paramData.staffList.forEach(staffRes => {
        this.staffData.staffList.push({
          ...staffRes,
          titleStr: TitleStrCreate(staffRes.titleCh, staffRes.titleEn)
        })
      })
      // canvas 处理
      this.columnData.data = []
      this.lineData.data = []
      this.waterfallData.data = []
      paramData.dataList.forEach(paramDataListRes => {
        // 产品计划排产
        this.lineInformationData.productPlanOutput += paramDataListRes.target
        // 产能趋势图 line-canvas
        this.lineData.data.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          output: null
        })
        // 产能趋势瀑布图 waterfall-canvas
        this.waterfallData.data.push({
          ...paramDataListRes,
          time: paramDataListRes.timeStr,
          output: paramDataListRes.offsetDay === null ? null : 0
        })
        // 当日各时段产能情况 column-canvas
        this.columnData.data.push(
            { ...paramDataListRes, name: '投入产能', typeEn: 'input', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '投入产能' },
            { ...paramDataListRes, name: '合格数量', typeEn: 'output', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '合格数量' },
            { ...paramDataListRes, name: '不良格量', typeEn: 'useless', time: paramDataListRes.timeStr, value: paramDataListRes.offsetDay === null ? null : 0, type: '不良数量' },
        )
      })
      // 产能信息
      this.lineOutputData.data.input = 0
      this.lineOutputData.data.ok = 0
      this.lineOutputData.data.useless = 0
      // 考勤信息 - 出勤、请假、缺席
      this.attendanceData.data.worker = paramData.attendance.normal ? paramData.attendance.normal : 0
      this.attendanceData.data.leave = paramData.attendance.leave ? paramData.attendance.leave : 0
      this.attendanceData.data.absence = paramData.attendance.absence ? paramData.attendance.absence : 0
      // 通知栏
      this.notifyCard.value = paramData.useless.description ? paramData.useless.description : '无'
    },
    // 处理 数据信息
    DialogDataData: function (dataRes) {
      const dataData = JSON.parse(JSON.stringify(dataRes))
      const nowTimeStamp = new Date().valueOf()
      dataData.dataList.forEach(dataDataListRes => {
        const dtObj = ProductType(dataDataListRes.productList, this.typeList)
        // 产能趋势图
        this.lineData.data.forEach((lineDataRes, lineDataIndex) => {
          if (dataDataListRes.startTime.timeStamp === lineDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === lineDataRes.endTime.timeStamp) {
            if (lineDataRes.startTime.timeStamp < nowTimeStamp && nowTimeStamp < lineDataRes.endTime.timeStamp) lineDataRes.now = true
            if (nowTimeStamp < lineDataRes.startTime.timeStamp) lineDataRes.late = true
            lineDataRes.value = dtObj.ok
            lineDataRes.output = dtObj.ok
            if (lineDataIndex > 0) lineDataRes.output += this.lineData.data[lineDataIndex - 1].output
          }
        })
        // 产能趋势瀑布图
        this.waterfallData.data.forEach((waterfallDataRes) => {
          if (dataDataListRes.startTime.timeStamp === waterfallDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === waterfallDataRes.endTime.timeStamp) {
            if (waterfallDataRes.startTime.timeStamp < nowTimeStamp && nowTimeStamp < dataDataListRes.endTime.timeStamp) waterfallDataRes.now = true
            waterfallDataRes.output = dtObj.ok
            // 产能趋势图 - 超出时间将其赋 null
            // if (nowTimeStamp < dataDataListRes.startTime.timeStamp) {
            //   waterfallDataRes.output = 0
            // }
          }
        })
        // 当日各时段产能情况 + 产能信息 投入，合格，不良
        this.columnData.data.forEach(columnDataRes => {
          if (dataDataListRes.startTime.timeStamp === columnDataRes.startTime.timeStamp && dataDataListRes.endTime.timeStamp === columnDataRes.endTime.timeStamp) {
            // 当日各时段产能情况
            switch (columnDataRes.typeEn) {
              case 'input': {
                columnDataRes.value += dtObj.input
                // 产能信息 投入
                this.lineOutputData.data.input += dtObj.input
                break
              }
              case 'output': {
                columnDataRes.value += dtObj.ok
                // 产能信息 合格
                this.lineOutputData.data.ok += dtObj.ok
                break
              }
              case 'useless': {
                columnDataRes.value += dtObj.ng
                // 产能信息 不良
                this.lineOutputData.data.useless += dtObj.ng
                break
              }
              // case 'repair': columnDataRes.value += dtObj.repair; break
              default: break
            }
          }
        })
      })
    },
    // 处理 children 信息
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

<style scoped>

</style>
