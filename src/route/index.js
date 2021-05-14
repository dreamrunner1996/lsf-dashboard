import Vue from 'vue'
import VueRouter from 'vue-router'

// import NoPage from '../views/NoPage/NoPage'
import NoPage from '../views/NoPage/NoPage'
import Select from '../views/Select/Select'
import SelectNew from '../views/SelectNew/SelectNew'
import TableDashboard from '../views/BY/TableDashboard/TableDashboard'
import StackDashboard from '../views/BY/StackDashboard/StackDashboard'
import BYNewTable from '../views/BYNew/BYNewTable/BYNewTable'
import BYNewStack from '../views/BYNew/BYNewStack/BYNewStack'
// import XBDashboard from '../views/XB/XBDashboard/XBDashboard'
// import XBMDDashboard from '../views/XB/XBMDDashboard/XBMDDashboard'
// import XBAllDashboard from '../views/XB/XBAllDashboard/XBAllDashboard'
import XinBaoAllDashboard from '../views/XB/All/XinBaoAllDashboard'
import XinBaoLineDashboard from '../views/XB/Line/XinBaoLineDashboard'
import XinBaoStackDashboard from '../views/XB/Stack/XinBaoStackDashboard'
import DCDashboard from '../views/DC/DCDashboard/DCDashboard'
import Other from '../views/Other/Other'
import UniversalLine from '../views/Universal/UniversalLine/UniversalLine'
import UniversalStack from '../views/Universal/UniversalStack/UniversalStack'
import UniversalLineClear from '../views/Universal/UniversalLineClear/UniversalLineClear'
import UniversalStackClear from '../views/Universal/UniversalStackClear/UniversalStackClear'
import SLSLine from '../views/SLS/SLSLine/SLSLine'

Vue.use(VueRouter)

const routes = [
    { path: '*', name: 'NoPage', component: NoPage },
    { path: '/select', name: 'SelectPage', component: Select },
    { path: '/select-new', name: 'SelectNew', component: SelectNew },
    // 比依 旧  --  Line 线体看板, Stack 码垛(线尾)看板
    { path: '/table', name: 'TableDashboard', component: TableDashboard },
    { path: '/stack', name: 'StackDashboard', component: StackDashboard },
    // 比依 新  --  Line 线体看板, Stack 码垛(线尾)看板
    { path: '/BiYiLine', name: 'BYNewTableDashboard', component: BYNewTable },
    { path: '/BiYiStack', name: 'BYNewStackDashboard', component: BYNewStack },
    // 新宝  --  All 总看板, Line 线体看板, Stack 码垛(线尾)看板
    { path: '/XinBaoAll', name: 'XinBaoAll', component: XinBaoAllDashboard },
    { path: '/XinBaoLine', name: 'XinBaoLine', component: XinBaoLineDashboard },
    { path: '/XinBaoStack', name: 'XinBaoStack', component: XinBaoStackDashboard },
    // 其它
    { path: '/other', name: 'Other', component: Other },
    // 德昌  --  看板
    { path: '/DeChangItem', name: 'DeChang', component: DCDashboard },
    // 通用  --  Line 通用线体看板, Stack 通用码垛看板
    { path: '/UniversalLine', name: 'UniversalLine', component: UniversalLine },
    { path: '/UniversalStack', name: 'UniversalStack', component: UniversalStack },
    { path: '/UniversalLineClear', name: 'UniversalLineClear', component: UniversalLineClear },
    { path: '/UniversalStackClear', name: 'UniversalStackClear', component: UniversalStackClear },
    // 抓啦抓  --  看板
    { path: '/SLSLine', name: 'SLSLine', component: SLSLine }
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'hash',
    routes
})

export default router
