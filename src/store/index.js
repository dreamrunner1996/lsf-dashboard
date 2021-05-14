// 访问用 this.$root.$data.store.devUrl 等访问    --   可读可写
const store = {
    // devUrl1: 'http://192.168.3.82:8000',
    devUrl: 'http://localhost:1234',
    url: '',
    scanTime: {
        table: 5000,
        stack: 5000,
        simulateTime: 5000
    },
    axiosUrl: '',
    readDataUrl: '/api/mdcDashboard/dashboard/read',
    // readDataUrl: '/api/mdcDashboard/dashboard/readAll',
    product: '/api/mdcDashboard/dashboard/data',
    simulate: '/api/mdcDashboard/dashboard/data/mockParam',
    displayParams: '/api/mdcDashboard/dashboard/param',
    displayParam: '/api/mdcDashboard/dashboard/paramThis',
    output: '/api/mdcDashboard/dashboard/produce',
    device: '/api/mdcDashboard/device',
    readProtocol: '/api/mdcDashboard/dashboard/readProtocol'
}

export default store
