import timeToTimestamp from '../../api/timeToTimestamp'

function DialogReadDataParam (paramRes) {
    let paramData = {
        type: 'param data',
        id: null,
        dataSource: null,
        useless: {},
        config: {},
        information: {},
        staffList: [],
        attendance: {},
        dataList: []
    }
    paramData.id = paramRes.id

    // 暂时用不上的数据
    paramData.useless = {
        dataSource: paramRes.showDatasource,
        group: paramRes.group,
        description: paramRes.description,
        showType: paramRes.showType,
        showParam: paramRes.showParam,
        dataType: paramRes.dataType
    }

    // 配置数据
    paramData.config = {
        title: paramRes.title,
        logoPath: paramRes.logoPath,
        dataOffset: paramRes.dataOffset
    }

    // 产品、客户 介绍数据
    paramData.information = {
        dataTarget: paramRes.dataTarget,
        orderCode: paramRes.orderCode,
        orderNum: paramRes.orderNum,
        orderCustomer: paramRes.orderCustomer,
        orderDestination: paramRes.orderDestination,
        productModel: paramRes.productModel,
        productName: paramRes.productName,
        productSpec: paramRes.productSpec,
        productImage: paramRes.productImg,
        dataHidden: paramRes.dataHidden
    }
    paramRes.dataHidden.forEach(dataHiddenRes => {
        paramData.information[dataHiddenRes] = '****'
    })

    // 职工数据
    paramData.staffList = []
    if (paramRes.staff && paramRes.staff instanceof Array && paramRes.staff.length) {
        paramRes.staff.forEach((staffRes, staffIndex) => {
            paramData.staffList.push({
                id: staffIndex + 1,
                name: staffRes.name,
                titleCh: staffRes.titleCh,
                titleEn: staffRes.titleEn,
                contact: staffRes.contact,
                image: staffRes.image
            })
        })
    }

    // 考勤数据
    paramData.attendance = {
        all: paramRes['attendanceNum'],
        normal: paramRes['attendanceAll'],
        leave: paramRes['attendanceLeave'],
        absence: paramRes['attendanceNum'] - paramRes['attendanceAll'] - paramRes['attendanceLeave']
    }

    // 时段数据
    paramData.dataList = []
    if (paramRes['dataSlot'] && paramRes['dataSlot'] instanceof Array && paramRes['dataSlot'].length) {
        paramRes['dataSlot'].forEach((dataRes, dataIndex) => {
            const startTime = dataRes.time[0]
            const endTime = dataRes.time[1]
            const offsetDay = dataRes.offsetDay
            paramData.dataList.push({
                id: dataIndex + 1,
                timeStr: startTime + '-' + endTime,
                startTime: timeToTimestamp(startTime, offsetDay),
                endTime: timeToTimestamp(endTime, offsetDay),
                target: dataRes.target,
                offsetDay: dataRes.offsetDay
            })
        })
    }

    return paramData
}

export default DialogReadDataParam
