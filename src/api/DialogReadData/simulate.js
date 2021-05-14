import timeToTimestamp from '../../api/timeToTimestamp'

function DialogReadDataSimulate (simulateRes) {
    let simData = {
        type: 'simulate data',
        dataSource: null,
        dataList: []
    }

    if (simulateRes.length) {
        simulateRes.forEach((simRes, simIndex) => {
            const startTime = simRes.time[0]
            const endTime = simRes.time[1]
            const offsetDay = simRes.offsetDay
            const productItem = {
                id: simIndex + 1,
                status: simRes.status,
                type: simRes.type,
                expected: simRes.expected,
                offset: simRes.offset
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
                        id: simIndex + 1,
                        timeStr: startTime + '-' + endTime,
                        startTime: timeToTimestamp(startTime, offsetDay),
                        endTime: timeToTimestamp(endTime, offsetDay),
                        type: simRes.status,
                        productList: [ productItem ],
                        target: simRes.expected,
                        offset: simRes.offset
                    })
                }
            } else {
                simData.dataList.push({
                    id: simIndex + 1,
                    timeStr: startTime + '-' + endTime,
                    startTime: timeToTimestamp(startTime, offsetDay),
                    endTime: timeToTimestamp(endTime, offsetDay),
                    type: simRes.status,
                    productList: [ productItem ],
                    target: simRes.expected,
                    offset: simRes.offset
                })
            }
        })
    }

    return simData
}

export default DialogReadDataSimulate
