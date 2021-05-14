function timeToTimestamp (timeStr, offsetDay = 0) {
    let timeList = {
        fullTime: null,
        time: null,
        timeStamp: null
    }

    function addString0 (str) {
        return str < 10 ? '0' + str : str
    }

    const timeStrArr = timeStr.split(':')
    const myDate = new Date()
    const y = myDate.getFullYear()
    const m = myDate.getMonth() + 1
    const d = myDate.getDate() + offsetDay
    const h = timeStrArr[0]
    const mm = timeStrArr[1]
    const s = timeStrArr[2] ? timeStrArr[2] : 0

    timeList.fullTime = y + '-' + addString0(m) + '-' + addString0(d) + ' ' + h + ':' + mm + ':' + addString0(s)
    timeList.time = timeStr
    timeList.timeStamp = new Date(`${y}-${m}-${d} ${h}:${mm}:${s}`).valueOf()

    return timeList
}

export default timeToTimestamp
