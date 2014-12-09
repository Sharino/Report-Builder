/* exported RangeSelectorControlModel */
/* global moment */
var RangeSelectorControlModel = Backbone.Model.extend({

    defaults: {
        ActiveFieldNumber: 0,
        StartDate: null,
        EndDate: null,
        DateFormat: '',
        MinAllowedDate: null,
        MaxAllowedDate: null,
        MonthMode: false
    },

    initialize: function (options) {

        if (!options) {
            throw 'Options must be provided for range selector model';
        }

        if ('dateFormat' in options) {
            this.set('DateFormat', options.dateFormat);
        } else {
            throw 'Date format must be provided for range selector model';
        }

        if ('startDate' in options) {
            this.set('StartDate', options.startDate);
        } else {
            throw 'Start date must be provided for range selector model';
        }

        if ('endDate' in options) {
            this.set('EndDate', options.endDate);
        } else {
            throw 'End date must be provided for range selector model';
        }

        if ('minDate' in options) {
            this.set('MinAllowedDate', options.minDate);
        } else {
            throw 'Minimum allowed date should be specified';
        }

        if ('maxDate' in options) {
            this.set('MaxAllowedDate', options.maxDate);
        } else {
            throw 'Maximum allowed date should be specified';
        }

        if ('monthMode' in options) {
            this.set('MonthMode', options.monthMode);
        }

        this._roundDatesForMonthMode();

        this.set('ActiveFieldNumber', 1);
    },

    setStartDate: function (dateObj) {

        if (this._areDatesSame(dateObj, this.get('StartDate'))) {

            if (this._isDateObjectValid(dateObj)) {

                // Just change the active field if the date being set is the same:
                this.set('ActiveFieldNumber', 2);
            }
            return;
        }

        var validDateRangeSelected = false;

        this.set('StartDate', null);
        this.set('ActiveFieldNumber', 1);

        if (this._isDateObjectValid(dateObj)) {

            this.set('StartDate', this._truncateDateObj(dateObj));
            this._roundStartDateForMonthMode();

            this.set('ActiveFieldNumber', 2);

            if (this._isDateObjectValid(this.get('EndDate')) && !this._isEndDateLessThenStartDate()) {

                validDateRangeSelected = true;

            } else {

                this.set('EndDate', null);

                if (this.get('MonthMode')) {
                    this.set('EndDate', moment(this.get('StartDate')).clone().endOf('month').toDate());
                    validDateRangeSelected = true;
                }

            }
        }

        if (validDateRangeSelected) {
            this.triggerRangeSelectedEvent();
        }

        this.triggerRangeChangedEvent();
    },

    setEndDate: function (dateObj) {

        if (this._areDatesSame(dateObj, this.get('EndDate'))) {

            if (this._isDateObjectValid(dateObj)) {

                // Just change the active field if the date being set is the same:
                this.set('ActiveFieldNumber', 1);
            }
            return;
        }

        var validDateRangeSelected = false;

        this.set('EndDate', null);
        this.set('ActiveFieldNumber', 2);

        if (this._isDateObjectValid(dateObj)) {

            this.set('EndDate', this._truncateDateObj(dateObj));
            this._roundEndDateForMonthMode();

            this.set('ActiveFieldNumber', 1);

            if (this._isDateObjectValid(this.get('StartDate')) && this._isEndDateLessThenStartDate()) {

                this.set('EndDate', null);
                this.setStartDate(dateObj);

                return;
            }

            if (this._isDateObjectValid(this.get('StartDate'))) {

                validDateRangeSelected = true;

            } else if (this.get('MonthMode')) {
                this.set('StartDate', moment(this.get('EndDate')).clone().startOf('month').toDate());
                validDateRangeSelected = true;
            }

        }

        if (validDateRangeSelected) {
            this.triggerRangeSelectedEvent();
        }

        this.triggerRangeChangedEvent();
    },

    getFormatedStartDate: function () {
        return this._getFormatedDate(this.get('StartDate'));
    },

    getFormatedEndDate: function () {
        return this._getFormatedDate(this.get('EndDate'));
    },

    _areDatesSame: function (date, dateToCompare) {

        if (date === null && dateToCompare === null) {
            return true;
        }

        if ((date === null && dateToCompare !== null) || (date !== null && dateToCompare === null)) {
            return false;
        }

        if ((this._isDateObjectValid(date) && !this._isDateObjectValid(dateToCompare)) || (!this._isDateObjectValid(date) && this._isDateObjectValid(dateToCompare))) {
            return false;
        }

        return moment(date).format('YYYY-MM-DD') === moment(dateToCompare).format('YYYY-MM-DD') || (this.get('MonthMode') && moment(date).format('YYYY-MM') === moment(dateToCompare).format('YYYY-MM'));
    },

    _getFormatedDate: function (dateObj) {
        if (this._isDateObjectValid(dateObj)) {
            return moment(dateObj).format(this.get('DateFormat'));
        } else {
            return '';
        }
    },

    _isDateObjectValid: function (dateObj) {
        return (dateObj && moment(dateObj).isValid());
    },

    _isDateStringValid: function (dateStr) {
        return dateStr && moment(dateStr, this.get('DateFormat'), true).isValid() && this._isDateObjectValid(moment(dateStr, this.get('DateFormat')).toDate());
    },

    _isEndDateLessThenStartDate: function () {
        return moment(this.get('EndDate')).diff(moment(this.get('StartDate'))) < 0;
    },

    _truncateDateObj: function (dateObj) {

        if (moment(dateObj).diff(moment(this.get('MinAllowedDate'))) < 0) {
            return moment(this.get('MinAllowedDate')).clone().toDate();
        } else if (moment(this.get('MaxAllowedDate')).diff(dateObj) < 0) {
            return moment(this.get('MaxAllowedDate')).clone().toDate();
        } else {
            return dateObj;
        }
    },

    _roundDatesForMonthMode: function () {
        if (this.get('MonthMode')) {

            this._roundStartDateForMonthMode();
            this._roundEndDateForMonthMode();

            this.set('MinAllowedDate', moment(this.get('MinAllowedDate')).clone().startOf('month').toDate());
            this.set('MaxAllowedDate', moment(this.get('MaxAllowedDate')).clone().endOf('month').toDate());
        }
    },

    _roundStartDateForMonthMode: function () {
        if (this.get('MonthMode')) {
            this.set('StartDate', moment(this.get('StartDate')).clone().startOf('month').toDate());
        }
    },

    _roundEndDateForMonthMode: function () {
        if (this.get('MonthMode')) {
            this.set('EndDate', moment(this.get('EndDate')).clone().endOf('month').toDate());
        }
    },

    setStartDateFromString: function (dateStr) {

        if (this._isDateStringValid(dateStr)) {
            this.setStartDate(moment(dateStr, this.get('DateFormat')).toDate());
        } else {
            this.setStartDate(null);
        }
    },

    setEndDateFromString: function (dateStr) {

        if (this._isDateStringValid(dateStr)) {
            this.setEndDate(moment(dateStr, this.get('DateFormat')).toDate());
        } else {
            this.setEndDate(null);
        }
    },

    triggerRangeSelectedEvent: function () {
        this.trigger('rangeSelected');
    },

    triggerRangeChangedEvent: function () {
        this.trigger('rangeChanged');
    }

});
/* exported RangeSelectorControlsView */
/* global Handlebars */
var RangeSelectorControlsView = Backbone.View.extend({

    events: {
        'change #firstFrom': '_startDateChangedAction',
        'change #firstTo': '_endDateChangedAction',
        'click #firstFrom': '_startDateClickedAction',
        'click #firstTo': '_endDateClickedAction',
        'blur #firstFrom': '_forceFocus',
        'blur #firstTo': '_forceFocus',
    },

    initialize: function () {
        this.model.on('change:ActiveFieldNumber', this._renderActiveFieldChanged, this);
        this.model.on('change:StartDate', this._renderStartDateChanged, this);
        this.model.on('change:EndDate', this._renderEndDateChanged, this);
        this.model.on('rangeChanged', this._renderRangeChanged, this);

        this.calendarPlaceholderId = '#calendar';
    },

    render: function () {
        this.$el.html(Handlebars.compile($('#rangeSelectorTemplate').html())({}));

        $('body').prepend(this.$el);

        this._setPlaceholders();

        this._renderRangeChanged();
    },

    _forceFocus: function (event) {
        var newFocusedElement = event.relatedTarget;

        // check if focus was lost to focusable outside element. If so do not steal focus from it, else enforce focus.
        if (!newFocusedElement) {
            this.focus();
        } else {
            var candidateParent = $(newFocusedElement).closest('#rangeSelectorWrapper');
            var realParent = this.$el.find('#rangeSelectorWrapper');

            // if focus lost to some other focusable element in current el we have to force focus. Else we have parent with same id, but different ref
            if (candidateParent.length !== 0 && candidateParent[0] === realParent[0]) {
                this.focus();
            }
        }
    },

    focus: function () {
        this._renderActiveFieldChanged();
    },

    _renderRangeChanged: function () {
        this._renderActiveFieldChanged();
        this._renderStartDateChanged();
        this._renderEndDateChanged();
    },

    _startDateClickedAction: function () {
        this.model.set('ActiveFieldNumber', 1);
    },

    _endDateClickedAction: function () {
        this.model.set('ActiveFieldNumber', 2);
    },

    _startDateChangedAction: function () {
        this.model.setStartDateFromString(this.$el.find('#firstFrom').val());
        this._renderStartDateChanged(); // if we provided bad date to field  while he had bad date, we have to make render or bad value will remain in field (no event fires from model changing bad date to bad date)
    },

    _endDateChangedAction: function () {
        this.model.setEndDateFromString(this.$el.find('#firstTo').val());
        this._renderEndDateChanged();
    },

    _setPlaceholders: function () {
        var dateFormat = this.model.get('DateFormat');

        this.$el.find('#firstFrom').attr('placeholder', dateFormat);
        this.$el.find('#firstTo').attr('placeholder', dateFormat);
    },

    _renderActiveFieldChanged: function () {
        var activeField = this.model.get('ActiveFieldNumber');

        switch (activeField) {
            case 1:
                this.$el.find('#firstFrom').focus();
                break;
            case 2:
                this.$el.find('#firstTo').focus();
                break;
        }
    },

    _renderStartDateChanged: function () {
        var formatedStartDate = this.model.getFormatedStartDate();
        var fromInputElement = this.$el.find('#firstFrom');

        fromInputElement.val(formatedStartDate);

        this._renderErrorNotification(fromInputElement, formatedStartDate === '');
    },

    _renderEndDateChanged: function () {
        var formatedEndDate = this.model.getFormatedEndDate();
        var toInputElement = this.$el.find('#firstTo');

        this._renderErrorNotification(toInputElement, formatedEndDate === '');

        toInputElement.val(formatedEndDate);
    },

    _renderErrorNotification: function (element, isError) {
        if (isError) {
            element.addClass('error');
        } else {
            element.removeClass('error');
        }
    },

    destroy: function () {
        this.$el.off();
        this.$el.remove();

        this.model.off(null, null, this);
    }
});
/* global RangeSelectorControlModel, RangeSelectorControlsView */
(function ($) {
    var RangeSelector = function (options) {
        var rangeStart = options.rangeStart;
        var rangeEnd = options.rangeEnd;

        var maxAllowedRangeDate = options.maxAllowedRangeDate;
        var minAllowedRangeDate = options.minAllowedRangeDate;

        var monthMode = options.monthMode;

        var dateFormat = options.dateFormat;

        var model = new RangeSelectorControlModel({
            startDate: rangeStart,
            endDate: rangeEnd,
            minDate: minAllowedRangeDate,
            maxDate: maxAllowedRangeDate,
            monthMode: monthMode,
            dateFormat: dateFormat
        });

        var view = new RangeSelectorControlsView({
            model: model
        });

        view.render();

        var calendarOptions = {
            container: view.calendarPlaceholderId,
            popupAnchor: options.rangeControl,
            startDay: 1,
            displayMonths: 1,
            scrollAmmount: 1,
            multiselect: true,
            deselectOnChange: false,
            duration: [model.get('MinAllowedDate'), model.get('MaxAllowedDate')],
            disableWeekDayClick: true,
            scroolToFullState: true
        };

        var calendar = new window.Adform.Calendar(calendarOptions);

        $(calendar).on('AdformCalendar:select:day', function () {

            var activeField = model.get('ActiveFieldNumber');
            var selected = calendar.getSelected()[0];

            if (activeField === 2) {
                model.setEndDate(selected);
            } else {
                model.setStartDate(selected);
            }
        });

        $(calendar).on('AdformCalendar:unselect:day', function (e, eventName, dateObj) {

            var activeField = model.get('ActiveFieldNumber');
            var startDate = model.get('StartDate');
            var endDate = model.get('EndDate');

            // Handling situation when the same date clicked two times in the calendar.
            // Second click generates 'unselect' event which needs to be handled in order to respond to users action
            if (activeField === 1 && endDate === dateObj) {
                model.setStartDate(endDate);
            } else if (activeField === 2 && startDate === dateObj) {
                model.setEndDate(startDate);
            }
        });

        $(calendar).on('AdformCalendar:opened', function () {
            view.focus();
        });

        var updateCalendar = function () {
            calendar.setState('none', model.get('MinAllowedDate'), model.get('MaxAllowedDate'));

            if (model.get('StartDate') && model.get('EndDate')) {
                calendar.setState('full', model.get('StartDate'), model.get('EndDate'));
            }

            calendar.deselectAll();
        };

        updateCalendar();

        model.on('rangeSelected', updateCalendar);

        model.on('rangeChanged', function () {

            if (!model.get('StartDate') || !model.get('EndDate')) {
                calendar.setState('none', model.get('MinAllowedDate'), model.get('MaxAllowedDate'));
            }
        });

        model.on('rangeSelected', function () {
            $(this).trigger('AdformRangeSelector:rangeSelected');
        }, this);
        model.on('rangeChanged', function () {
            $(this).trigger('AdformRangeSelector:rangeChanged');
        }, this);

        this.getRangeStartDate = function () {
            return model.get('StartDate');
        };

        this.getRangeEndDate = function () {
            return model.get('EndDate');
        };

        this.getFormatedRangeStart = function () {
            return model.getFormatedStartDate();
        };

        this.getFormatedRangeEnd = function () {
            return model.getFormatedEndDate();
        };

        this.setStartDate = function (date) {
            model.setStartDate(date);
        };

        this.setEndDate = function (date) {
            model.setEndDate(date);
        };

        this.destroy = function () {
            $(calendar).off();
            calendar.destroy();

            model.off(null, null, this);

            view.destroy();
        };
    };

    window.Adform = window.Adform || {};
    window.Adform.RangeSelector = RangeSelector;
    window.Adform.RangeSelector.RangeSelectorControlModel = RangeSelectorControlModel;

})(window.jQuery);