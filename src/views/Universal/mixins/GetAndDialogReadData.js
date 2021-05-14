import GetReadData from './../../../api/readData'

const getAndDialogReadData = {
    data: () => ({
        displayVal: 'all',
        pageConfig: {},
        getDataInterval: null // 获取数据 扫描周期 (interval)
    }),
    created: function () {
        // 获取当前页面 数据源
        if (this.$route.query) {
            this.pageConfig.configId = this.$route.query.configId
            this.pageConfig.protocolNames = this.$route.query.protocolNames ? this.$route.query.protocolNames : null
            this.pageConfig.optional = this.$route.query.optional ? this.$route.query.optional : []
            this.pageConfig.produceSize = this.$route.query.produceSize ? this.$route.query.produceSize : 0
        }
    },
    mounted: function () {
        if (this.$route.query.dataDisplay) {
            this.displayVal = this.$route.query.dataDisplay
        }
        if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
        /* 更新时间, 并进行定时刷新时间 */
        this.GetData()
        this.getDataInterval = window.setInterval(this.GetData, this.$root.$data.store.scanTime.table)
    },
    beforeDestroy: function () {
        /* 删除时间更新定时器, 避免占据缓存 */
        if (this.getDataInterval) { window.clearInterval(this.getDataInterval); this.getDataInterval = null }
    },
    methods: {
        // 获取数据 - 使用 async await 进行异步数据获取处理
        GetData: async function () {
            /* 获取 数据 */
            await GetReadData(this.$root.$data.store.devUrl + this.$root.$data.store.readDataUrl,
                this.pageConfig.configId,
                this.pageConfig.protocolNames,
                this.pageConfig.optional,
                this.pageConfig.produceSize
            ).then(res => {
                console.log(res)
                // 处理获取得到的参数
                this.DialogParamData(res['param'])
                if (this.displayVal === 'all' || this.displayVal === 'self') {
                    this.DialogDataData(res['dataList'])
                }
                this.DialogSimulateData(res['simulateList'])
                if (this.displayVal === 'all' || this.displayVal === 'children') {
                    this.DialogChildrenData(res['children'])
                }
                this.DialogProtocolNamesData(res['protocolList'])
            }).catch(err => { console.error(err) })
        },
        // 处理 页面参数配置数据  PS: 由于每个项目所需情况不一样，所以不能进行下方拓展。每个项目根据需要进行写入
        DialogParamData: function () {},
        // 处理 数据信息
        DialogDataData: function () {},
        // 处理 模拟信息
        DialogSimulateData: function () {},
        // 处理 children信息
        DialogChildrenData: function () {},
        // 处理 protocolNames 信息
        DialogProtocolNamesData: function () {}
    }
}

export default getAndDialogReadData
