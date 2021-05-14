function timestampToTime (timestamp) {
    let timeList = {
        fullTime: null,
        time: null,
        timeStamp: null
    }
    function addString0 (str) {
        return str < 10 ? '0' + str : str
    }

    if (timestamp) {
        const myDate = new Date(timestamp)
        const y = myDate.getFullYear()
        const m = myDate.getMonth() + 1
        const d = myDate.getDate()
        const h = myDate.getHours()
        const mm = myDate.getMinutes()
        const s = myDate.getSeconds()

        timeList.fullTime = y + '-' + addString0(m) + '-' + addString0(d) + ' ' + addString0(h) + ':' + addString0(mm) + ':' + addString0(s)
        timeList.timeStamp = timestamp
        timeList.time = addString0(h) + ':' + addString0(mm)
    }

    return timeList
}

export default timestampToTime
