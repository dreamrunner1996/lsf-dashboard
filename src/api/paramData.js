import Axios from 'axios'
// import timestampToTime from '@/api/timestampToTime'
import timeToTimestamp from '../api/timeToTimestamp'

async function GetParamData (url) {
    let paramData = {
        type: 'param data',
        dataSource: null,
        useless: {},
        config: {},
        staffList: [],
        information: {},
        attendance: {},
        dataList: []
    }
    await Axios.get(url).then(res => {
        let resData = res.data
        if (res.data && res.data instanceof Array && res.data.length) {
            resData = res.data[0]
        }
        const getData = JSON.parse(JSON.stringify(resData))
        paramData.dataSource = resData.showDatasource

        paramData.useless = {
            ...paramData.useless,
            ...getData.group,
            showType: getData.showType,
            showParam: getData.showParam,
            showDatasource: getData.showDatasource
        }

        paramData.config = {
            title: getData.title,
            logoPath: getData.logoPath,
            dataType: getData.dataType,
            dataOffset: getData.dataOffset
        }

        paramData.information = {
            dataTarget: getData.dataTarget,
            orderCode: getData.orderCode,
            orderNum: getData.orderNum,
            orderCustomer: getData.orderCustomer,
            orderDestination: getData.orderDestination,
            productModel: getData.productModel,
            productName: getData.productName,
            productSpec: getData.productSpec,
            dataHidden: getData.dataHidden
        }

        paramData.staffList = []
        if (getData.staff && getData.staff instanceof Array && getData.staff.length) {
            getData.staff.forEach((staffRes, staffIndex) => {
                paramData.staffList.push({
                    id: staffIndex + 1,
                    name: staffRes.name,
                    titleCh: staffRes.titleCh,
                    titleEn: staffRes.titleEn,
                    contact: staffRes.contact,
                    iamge: staffRes.image
                })
            })
        }

        paramData.attendance = {
            all: getData['attendanceNum'],
            normal: getData['attendanceAll'],
            leave: getData['attendanceLeave'],
            absence: getData['attendanceNum'] - getData['attendanceAll'] - getData['attendanceLeave']
        }

        paramData.dataList = []
        if (getData['dataSlot'] && getData['dataSlot'] instanceof Array && getData['dataSlot'].length) {
            getData['dataSlot'].forEach((dataRes, dataIndex) => {
                const startTime = dataRes.time[0]
                const endTime = dataRes.time[1]
                const offsetDay = dataRes.offsetDay
                paramData.dataList.push({
                    id: dataIndex + 1,
                    timeStr: startTime + ' - ' + endTime,
                    startTime: timeToTimestamp(startTime, offsetDay),
                    endTime: timeToTimestamp(endTime, offsetDay),
                    target: dataRes.target,
                    offsetDay: dataRes.offsetDay
                })
            })
        }
    })
    return paramData
}

export default GetParamData
