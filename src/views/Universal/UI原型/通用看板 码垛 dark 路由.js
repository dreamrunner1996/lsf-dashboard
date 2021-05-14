import Vue from 'vue'
import VueRouter from 'vue-router'

import UniversalStack from '../UniversalStack/UniversalStack'

Vue.use(VueRouter)

const routes = [
    { path: '/UniversalStack', name: 'UniversalStack', component: UniversalStack }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'hash',
    routes
})

export default router
