import Axios from 'axios'

async function GetUrlParamData (url) {
    let urlParamData = {
        lineStatus: null,
        lineReserve: null
    }
    await Axios.get(url).then(res => {
        let resData = res.data
        // if (res.data && res.data instanceof Array && res.data.length) {
        //     resData = res.data[0]
        // }
        urlParamData.lineStatus = resData[0].data
        urlParamData.lineReserve = resData[1].data
    })
    return urlParamData
}

export default GetUrlParamData
