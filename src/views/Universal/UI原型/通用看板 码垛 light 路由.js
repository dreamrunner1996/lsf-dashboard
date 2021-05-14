import Vue from 'vue'
import VueRouter from 'vue-router'

import UniversalStackClear from '../UniversalStackClear/UniversalStackClear'

Vue.use(VueRouter)

const routes = [
    { path: '/UniversalStackClear', name: 'UniversalStackClear', component: UniversalStackClear }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'hash',
    routes
})

export default router
