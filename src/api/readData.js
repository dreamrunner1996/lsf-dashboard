import Axios from 'axios'
import DialogReadDataParam from '../api/DialogReadData/param'
import DialogReadDataData from '../api/DialogReadData/data'
import DialogReadDataSimulate from '../api/DialogReadData/simulate'
import DialogReadDataProtocol from '../api/DialogReadData/protocol'

async function GetReadData (url, configId, protocolNamesArr = [], optionalArr = [], produceSize = 0, otherStatus = '') {
    let readData = {
        type: 'read data'
    }
    let optionalStr = ''
    // const optional = ['children', 'produce', 'data', 'mock', 'protocol']
    if (optionalArr && !(optionalArr instanceof Array)) optionalArr = [optionalArr]
    if (optionalArr === null) optionalArr = []
    const optional = ['data', 'mock', 'protocol', ...optionalArr]
    if (optional instanceof Array && optional.length) {
        optional.forEach(optionalRes => {
            optionalStr += `&optional=${optionalRes}`
        })
    }

    let protocolNamesStr = ''
    if (protocolNamesArr && !(protocolNamesArr instanceof Array)) protocolNamesArr = [protocolNamesArr]
    if (protocolNamesArr === null) protocolNamesArr = []
    const protocolNames = [...protocolNamesArr]
    if (protocolNames instanceof Array && protocolNames.length) {
        protocolNames.forEach(protocolNamesRes => {
            protocolNamesStr += `&protocolNames=${protocolNamesRes}`
        })
    }
    if (protocolNamesArr.length === 0) protocolNamesStr = `&protocolNames=null`

    let produceSizeStr = ''
    if (produceSize) { produceSizeStr += `&produceSize=${produceSize}` }
    else { produceSizeStr = `&produceSize=10` }

    const paramUrl = `?configId=${configId}${optionalStr}${produceSizeStr}${protocolNamesStr}${otherStatus}`

    function DialogData (res) {
        let readDataObject = {}
        const getData = JSON.parse(JSON.stringify(res))
        readDataObject.sourceName = res['sourceName']
        readDataObject.configId = res.configId
        readDataObject.param = DialogReadDataParam(getData.param)
        readDataObject.dataList = DialogReadDataData(getData.data)
        readDataObject.simulateList = DialogReadDataSimulate(getData.mock)
        readDataObject.protocolList = DialogReadDataProtocol(getData.protocol)
        readDataObject.children = []
        if (getData.children && getData.children instanceof Array && getData.children.length) {
            getData.children.forEach(childrenRes => {
                readDataObject.children.push({ ...DialogData(childrenRes) })
            })
        }
        return readDataObject
    }
    await Axios.get(url + paramUrl).then(res => {
        let resData = res.data
        if (res.data && res.data instanceof Array && res.data.length) resData = res.data[0]
        readData = { ...readData, ...DialogData(resData) }
    })
    return readData
}

export default GetReadData
