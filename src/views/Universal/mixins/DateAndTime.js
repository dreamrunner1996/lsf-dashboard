const dateAndTime = {
    data: () => ({
        updateTimeInterval: null,
        dateTime: { date: '', week: '', time: '' }
    }),
    mounted: function () {
        /* 更新时间, 并进行定时刷新时间 */
        this.UpdateTime()
        this.updateTimeInterval = window.setInterval(this.UpdateTime, 1000)
    },
    beforeDestroy: function () {
        /* 删除时间更新定时器, 避免占据缓存 */
        if (this.updateTimeInterval) { window.clearInterval(this.updateTimeInterval); this.updateTimeInterval = null }
    },
    methods: {
        // 更新时间
        UpdateTime () {
            let date = new Date()
            this.dateTime.date = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
            this.dateTime.time = `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
            switch (date.getDay()) {
                case 0: { this.dateTime.week = '周日, Sun'; break }
                case 1: { this.dateTime.week = '周一, Mon'; break }
                case 2: { this.dateTime.week = '周二, Feb'; break }
                case 3: { this.dateTime.week = '周三, Wed'; break }
                case 4: { this.dateTime.week = '周四, Thu'; break }
                case 5: { this.dateTime.week = '周五, Fri'; break }
                case 6: { this.dateTime.week = '周六, Sat'; break }
                default: { this.dateTime.week = '-'; break }
            }
            date = null
        }
    }
}

export default dateAndTime
