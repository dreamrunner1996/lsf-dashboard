import Axios from 'axios'
import timestampToTime from '../api/timestampToTime'

async function GetJsonData (url) {
    let jsonData = {
        type: 'data data',
        dataSource: null,
        dataList: []
    }
    await Axios.get(url).then(res => {
        let resData = res.data
        if (res.data && res.data instanceof Array && res.data.length) {
            resData = res.data[0]
        }
        const getData = JSON.parse(JSON.stringify(resData))
        jsonData.dataSource = getData.datasource
        if (getData.data && getData.data instanceof Array && getData.data.length) {
            getData.data.forEach((getDataRes, getDataIndex) => {
                let productList = []
                if (getDataRes['categoryList'] && getDataRes['categoryList'] instanceof Array && getDataRes['categoryList'].length) {
                    getDataRes['categoryList'].forEach((cateRes, careIndex) => {
                        productList.push({
                            id: careIndex + 1,
                            state: cateRes.status,
                            type: cateRes.type,
                            value: cateRes.count
                        })
                    })
                }
                jsonData.dataList.push({
                    id: getDataIndex + 1,
                    startTime: timestampToTime(getDataRes.startTime),
                    endTime: timestampToTime(getDataRes.endTime),
                    timeStr: (timestampToTime(getDataRes.startTime).time && timestampToTime(getDataRes.endTime).time) ?
                        timestampToTime(getDataRes.startTime).time + ' - ' + timestampToTime(getDataRes.endTime).time :
                        null,
                    productList: productList
                })
            })
        }
    })
    return jsonData
}

export default GetJsonData
