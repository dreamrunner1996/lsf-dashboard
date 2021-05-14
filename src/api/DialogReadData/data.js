import timestampToTime from '../../api/timestampToTime'
// import timeToTimestamp from '@/api/timeToTimestamp'

function DialogReadDataData (dataRes) {
    let jsonData = {
        type: 'data data',
        dataSource: null,
        dataList: []
    }
    if (dataRes.length) {
        dataRes.forEach((dtRes, dtIndex) => {
            let productList = []
            if (dtRes && dtRes['categoryList'] && dtRes['categoryList'] instanceof Array && dtRes['categoryList'].length) {
                dtRes['categoryList'].forEach((cateRes, careIndex) => {
                    productList.push({
                        id: careIndex + 1,
                        state: cateRes.status,
                        type: cateRes.type,
                        value: cateRes.count
                    })
                })
                jsonData.dataList.push({
                    id: dtIndex + 1,
                    startTime: timestampToTime(new Date(dtRes.startTime).valueOf()),
                    endTime: timestampToTime(new Date(dtRes.endTime).valueOf()),
                    timeStr: (timestampToTime(new Date(dtRes.startTime)).time && timestampToTime(new Date(dtRes.endTime)).time) ?
                        timestampToTime(new Date(dtRes.startTime)).time + '-' + timestampToTime(new Date(dtRes.endTime)).time :
                        null,
                    productList: productList
                })
            }
        })
    }
    return jsonData
}

export default DialogReadDataData
