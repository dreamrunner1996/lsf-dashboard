import Vue from 'vue'
import VueRouter from 'vue-router'

import UniversalLineClear from '../UniversalLineClear/UniversalLineClear'

Vue.use(VueRouter)

const routes = [
    { path: '/UniversalLineClear', name: 'UniversalLineClear', component: UniversalLineClear }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'hash',
    routes
})

export default router
