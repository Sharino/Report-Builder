(function ($) {

    var DatePicker = function (options) {

        var $pickerControl = $(options.pickerControl);
        var $pickerInput = $pickerControl.find('input');
        var dateFormat = $pickerControl.data('format');
        var calendarId = 'calendar_' + $pickerControl.attr('id');
        var $calendarControl = $('<div id="' + calendarId + '" class="clearfix"></div>').appendTo('body');
        var isOptional = options.optionalField || false;
        var inViewDay = "";
        var inputDay = new Date(moment($pickerInput.val(), dateFormat));
        if (inputDay.getFullYear() > 1970) {
            inViewDay = inputDay;
        }

        var calendarOptions = {
            container: '#' + calendarId,
            popupAnchor: options.pickerControl,
            startDay: typeof (options.startDay) === 'undefined' ? 1 : options.startDay,
            multiselect: false,
            popup: true,
            picker: true,
            deselectOnChange: true,
            inViewDay: inViewDay,
            disableWeekDayClick: true
        };

        var updateInput = function () {
            $pickerInput.val(this.getSelectedDate());
            $(this).trigger('AdformDatePicker:change');
        };

        var updateCalendar = function () {
            this.setDate($pickerInput.val());
        };

        this.getSelectedDate = function () {
            var selectedDate = "";
            if (calendar.getSelected()[0]) {
                selectedDate = moment(calendar.getSelected()[0]).format(dateFormat);
            }
            return selectedDate;
        };

        this.setDate = function (date) {
            var newDate = new Date(moment(date, dateFormat));
            if (newDate.getFullYear() > 1970) {
                if ((newDate.getFullYear() < 2000) || (newDate.getFullYear() > 2100)) {
                    calendar.select(new Date());
                    $.proxy(updateInput, this)();
                } else {
                    calendar.select(newDate);
                    $.proxy(updateInput, this)();
                }
            } else {
                if (isOptional) {
                    calendar.select(new Date());
                    calendar.deselectAll();
                    $.proxy(updateInput, this)();
                } else {
                    $.proxy(updateInput, this)();
                }
            }
        };

        this.destroy = function () {
            $pickerInput.off('change', h_updateCalendar);
            $pickerInput = null;
            $pickerControl = null;
            $(calendar).off();
            calendar.destroy();
            $calendarControl.off();
            $calendarControl.remove();
        };

        $('#' + calendarId + ' .tooltip').css('width', $('#' + calendarId + ' .tooltip').width() + 'px');
        var calendar = new Adform.Calendar(calendarOptions);
        var h_updateInput = $.proxy(updateInput, this);
        var h_updateCalendar = $.proxy(updateCalendar, this);

        $(calendar).on('AdformCalendar:select:day', h_updateInput);
        $pickerInput.on('change', h_updateCalendar);

        if (inputDay.getFullYear() > 1970) {
            $.proxy(updateCalendar, this)();
        }
    };

    window.Adform = window.Adform || {};
    window.Adform.DatePicker = DatePicker;
})(jQuery);