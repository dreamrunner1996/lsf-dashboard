import { getLunar } from 'chinese-lunar-calendar'

const lunarDateAndTime = {
    data: () => ({
        updateLunarTimeInterval: null,
        lunarDateTime: { lunarDate: '', date: '', week: '', time: '' }
    }),
    mounted: function () {
        /* 更新时间, 并进行定时刷新时间 */
        this.UpdateLunarTime()
        this.updateLunarTimeInterval = window.setInterval(this.UpdateLunarTime, 1000)
    },
    beforeDestroy: function () {
        /* 删除时间更新定时器, 避免占据缓存 */
        if (this.updateLunarTimeInterval) { window.clearInterval(this.updateLunarTimeInterval); this.updateLunarTimeInterval = null }
    },
    methods: {
        // 更新时间
        UpdateLunarTime () {
            const date = new Date()
            this.lunarDateTime.date = `${date.getFullYear()}年${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}月${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}日`
            this.lunarDateTime.time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
            switch (date.getDay()) {
                case 0: { this.lunarDateTime.week = '周日'; break }
                case 1: { this.lunarDateTime.week = '周一'; break }
                case 2: { this.lunarDateTime.week = '周二'; break }
                case 3: { this.lunarDateTime.week = '周三'; break }
                case 4: { this.lunarDateTime.week = '周四'; break }
                case 5: { this.lunarDateTime.week = '周五'; break }
                case 6: { this.lunarDateTime.week = '周六'; break }
                default: { this.lunarDateTime.week = '-'; break }
            }
            const getLunarObj = getLunar(date.getFullYear(), date.getMonth() + 1, date.getDate())
            this.lunarDateTime.lunarDate = `农历${getLunarObj.dateStr}`
        }
    }
}

export default lunarDateAndTime
