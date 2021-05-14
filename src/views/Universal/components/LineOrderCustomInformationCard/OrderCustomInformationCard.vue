<template>
  <div class="order-custom-information-card-content">
    <div class="card-list">
      <div class="card-list-item">
        <div class="card-list-item-title">{{ titleArray[0] }}</div>
        <div class="card-list-item-value">{{ orderCustomInformationData.orderCode }}</div>
      </div>
      <div class="card-list-item">
        <div class="card-list-item-title">{{ titleArray[1] }}</div>
        <div class="card-list-item-value">{{ orderCustomInformationData.orderCustomer }}</div>
      </div>
      <div class="card-list-item">
        <div class="card-list-item-title">{{ titleArray[2] }}</div>
        <div class="card-list-item-value">{{ orderCustomInformationData.productModel }}</div>
      </div>
      <div class="card-list-item">
        <div class="card-list-item-title">{{ titleArray[3] }}</div>
        <div class="card-list-item-value">{{ orderCustomInformationData.outputNum }}</div>
      </div>
      <div class="card-list-item">
        <div class="card-list-item-title">{{ titleArray[4] }}</div>
        <div class="card-list-item-value">{{ orderCustomInformationData.targetNum }}</div>
      </div>
<!--      <div class="card-list-item">-->
<!--        <div class="card-list-item-title">{{ titleArray[5] }}</div>-->
<!--        <div class="card-list-item-value">{{ orderCustomInformationData.orderCustomer }}</div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import './order-custom-information-card.css'

export default {
  name: 'OrderCustomInformationCard',
  props: { orderCustomInformationData: { default: () => ({}), require: true, type: Object } },
  data: () => ({
    titleArray: ['订单号', '客户', '订单型号', '产品标准产能', '产品目标产能']
  }),
  mounted: function () {}
}
</script>
