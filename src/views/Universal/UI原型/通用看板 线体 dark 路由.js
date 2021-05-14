import Vue from 'vue'
import VueRouter from 'vue-router'

import UniversalLine from '../../../views/Universal/UniversalLine/UniversalLine'

Vue.use(VueRouter)

const routes = [
    { path: '/UniversalLine', name: 'UniversalLine', component: UniversalLine }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'hash',
    routes
})

export default router
