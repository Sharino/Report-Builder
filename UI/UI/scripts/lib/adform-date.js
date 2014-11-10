Date.prototype.getWeekNumber = function () {
    d = new Date(this);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 5 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000)) / 7);
    if (weekNo == 0) {
        d.dateAdd('-7 days');
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 5 - (d.getDay() || 7));
        yearStart = new Date(d.getFullYear(), 0, 1);
        weekNo = Math.ceil((((d - yearStart) / 86400000)) / 7) + 1;
    }
    return weekNo;
};

Date.prototype.dateAdd = function (p_Interval) {

    var valSecond = 1000;
    var valMinute = valSecond * 60;
    var valHour = valMinute * 60;
    var valDay = valHour * 24;
    var valWeek = valDay * 7;
    var valMonth = valWeek * 5;

    p_Interval = p_Interval.replace(/\s/g, '').toLowerCase();

    var koef = 1;

    if (p_Interval.substr(0, 1) == '-')
        koef = -1;

    var regex = /(\d+)(day|h|min|mon|y|s)/gi;
    var items = p_Interval.match(regex);
    var item, ma, m, num, val, pd, hh, mm, ss, dd, wd, a, b, y, m, yp, i2;
    for (var i = 0; i < items.length; i++) {
        item = items[i];
        ma = (new RegExp(regex)).exec(item);
        num = parseInt(ma[1], 10) * koef;
        val = ma[2];
        pd = new Date(this);
        hh = pd.getHours();
        mm = pd.getMinutes();
        ss = pd.getSeconds();
        dd = pd.getDate();
        wd = pd.getDay();
        y = pd.getFullYear();
        m = pd.getMonth();
        switch (val) {
            case 's':
                this.setTime(this.getTime() + valSecond * num);
                break;

            case 'min':
                this.setTime(this.getTime() + valMinute * num);
                break;

            case 'h':
                this.setTime(this.getTime() + valHour * num);
                break;

            case 'day':
                var tmp = this.getDate();
                this.setTime(this.getTime() + valDay * num);
                if (this.getDate() == tmp)
                    this.setTime(this.getTime() + valHour * 2 * koef);
                this.setHours(hh, mm, ss);
                break;

            case 'week':
                this.setTime(this.getTime() + valWeek * num + valHour * 2 * koef);
                this.setHours(hh, mm, ss);
                break;

            case 'mon':
                this.setMonth(this.getMonth() + num);
                break;

            case 'y':
                this.setYear(y);
                this.setMonth(m);
                this.setDate(dd);
                for (i2 = 0 ; i2 < Math.abs(num) ; i2++) {
                    this.setYear(this.getFullYear() + koef);
                };
                this.setHours(hh, mm, ss);
                break;

        }
    };
};