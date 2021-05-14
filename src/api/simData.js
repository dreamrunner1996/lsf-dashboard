import Axios from 'axios'
// import timestampToTime from '@/api/timestampToTime'
import timeToTimestamp from '../api/timeToTimestamp'

async function GetSimData (url) {
    let simData = {
        type: 'simulate data',
        dataSource: null,
        dataList: []
    }
    await Axios.get(url).then(res => {
        let resData = res.data
        if (res.data && res.data instanceof Array && res.data.length) {
            resData = res.data[0]
        }
        const getData = JSON.parse(JSON.stringify(resData))

        simData.dataSource = getData.datasource
        if (getData.data && getData.data instanceof Array && getData.data.length) {
            getData.data.forEach((dataRes, dataIndex) => {
                const startTime = dataRes.time[0]
                const endTime = dataRes.time[1]
                const offsetDay = dataRes.offsetDay
                const productItem = {
                    id: dataIndex + 1,
                    status: dataRes.status,
                    type: dataRes.type,
                    expected: dataRes.expected,
                    offset: dataRes.offset
                }
                if (simData.dataList.length) {
                    let productListStatus = false
                    simData.dataList.forEach(simRes => {
                        if (simRes.startTime.timeStamp === timeToTimestamp(startTime, offsetDay).timeStamp && simRes.endTime.timeStamp === timeToTimestamp(endTime, offsetDay).timeStamp) {
                            simRes.productList.push(productItem)
                            productListStatus = true
                        }
                    })
                    if (!productListStatus) {
                        simData.dataList.push({
                            id: dataIndex + 1,
                            timeStr: startTime + ' - ' + endTime,
                            startTime: timeToTimestamp(startTime, offsetDay),
                            endTime: timeToTimestamp(endTime, offsetDay),
                            type: dataRes.status,
                            productList: [ productItem ],
                            target: dataRes.expected,
                            offset: dataRes.offset
                        })
                    }
                } else {
                    simData.dataList.push({
                        id: dataIndex + 1,
                        timeStr: startTime + ' - ' + endTime,
                        startTime: timeToTimestamp(startTime, offsetDay),
                        endTime: timeToTimestamp(endTime, offsetDay),
                        type: dataRes.status,
                        productList: [ productItem ],
                        target: dataRes.expected,
                        offset: dataRes.offset
                    })
                }
            })
        }
    })

    return simData
}

export default GetSimData
