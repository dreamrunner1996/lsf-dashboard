import Vue from 'vue'
import App from './App.vue'

import store from '@/store'
import router from '@/route'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  data: { store },
  render: h => h(App)
}).$mount('#app')
