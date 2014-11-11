var AdformCalendarVersion = 'v2.01';
(function ($) {

    var Calendar = function (options) {

        /* Options definition and default value setup */
        var options = options || {};
        var calendarType = options.calendarType || 'small';
        var weekDayOrder = options.weekDayOrder || [0, 1, 2, 3, 4, 5, 6];
        var startDay = Math.min(6, Math.max(0, options.startDay || 0));
        var inViewDay = options.inViewDay || new Date();
        var scroolToFullState = options.scroolToFullState || false;
        var duration = options.duration || false;
        var displayMonths = options.displayMonths || 1;
        var scrollAmmount = options.scrollAmmount || 1;
        var popup = options.popup || false;
        var picker = options.picker || false;
        var popupAnchor = options.popupAnchor || false;
        var container = options.container || false;
        var deselectOnChange = typeof (options.deselectOnChange) == 'undefined' ? true : options.deselectOnChange;
        if (picker) {
            displayMonths = 1;
            scrollAmmount = 1;
        };
        var disableWeekDayClick = options.disableWeekDayClick || false;
        var multiselect = options.multiselect || false;

        /* Reset week day order according to startDay */
        var firstDay;
        while (weekDayOrder[0] != startDay) {
            firstDay = weekDayOrder.shift();
            weekDayOrder.push(firstDay);
        };
        delete firstDay;

        /* Globalization shortcuts */
        var Culture = Globalize.culture();
        var Locale = Culture.calendars.standard;

        /* Predefine variables to ease date/time calculations */
        var valDay = 86400000;
        var valHour = 3600000;
        var valMinute = 60000;

        var lastClickedDay = false;

        /* Models */
        var Models = {

            Day: Backbone.Model.extend({
                /*
                date: date
                monthId: string
                state: string ( none | partial | full )
                selected: boolean
                disabled: boolean
                weekNo: int
                weekDayNr: int
                weekDaySequenceId: int
                gorup: string
                */
            })
        };

        var Collections = {
            Days: Backbone.Collection.extend({
                model: Models.Day
            })
        };

        var Views = {};

        Views.Day = Backbone.View.extend({

            tagName: 'td',

            events: {
                'click': 'clickDay'
            },

            initialize: function (options) {
                this.monthId = options.monthId;
                this.render();
                this.model.on('change:selected', this.changeSelected, this);
                this.model.on('change:state', this.changeState, this);
                this.model.on("destroy", this.destroy, this);
            },

            destroy: function () {
                this.remove();
                this.off();
            },

            render: function () {
                this.changeState();
                this.changeSelected();

                if (this.model.get('date').getMonth() !== this.monthId) {
                    this.$el.addClass('foreign-month');
                };

                if (this.model.get('disabled')) {
                    this.$el.addClass('disabled');
                };

                if (this.model.get('date').getTime() == new Date().setHours(12, 0, 0, 0)) {
                    this.$el.addClass('today');
                };

                this.$el.html('<div class="cell"></div>' + this.model.get('date').getDate());
            },

            /* Model "change" handlers */
            changeSelected: function () {
                if (this.model.get('selected')) {
                    this.$el.addClass('selected');
                } else {
                    this.$el.removeClass('selected');
                }
            },

            changeState: function () {
                this.$el.removeClass('full').removeClass('partial').removeClass('none');
                this.$el.addClass(this.model.get('state'));
            },

            clickDay: function (e) {
                e.preventDefault();
                if (this.$el.hasClass('inactive') || this.$el.hasClass('disabled')) {
                    return;
                };

                if (!multiselect) {
                    e.ctrlKey = false;
                    e.shiftKey = false;
                };
                if (e.shiftKey && dayCollection.where({ 'selected': true }).length > 0) {
                    var current = this.model.get('date');

                    var point1 = new Date(Math.min(lastClickedDay.getTime(), current.getTime()));
                    var point2 = Math.max(lastClickedDay.getTime(), current.getTime());

                    while (point1.getTime() <= point2) {
                        dayCollection.get(point1.getTime()).set('selected', true);
                        point1.dateAdd('+1 day');
                    };
                    CalendarEvents.trigger('select:range');

                } else {
                    if (!e.ctrlKey && (!this.model.get('selected') || dayCollection.where({ 'selected': true }).length > 1)) {
                        var currentlySelected = dayCollection.where({ 'selected': true });
                        _.each(currentlySelected, function (model) {
                            model.set('selected', false);
                            if (!multiselect) {
                                model.set('state', 'none');
                            }
                        });
                        if (currentlySelected.length > 1) {
                            CalendarEvents.trigger('unselect:range');
                        } else if (currentlySelected.length > 0) {
                            CalendarEvents.trigger('unselect:day', currentlySelected[0].date);
                        }
                    };

                    if (multiselect) {
                        this.model.set('selected', !this.model.get('selected'));
                    } else {
                        this.model.set('selected', true);
                    }
                    if (!multiselect && this.model.get('selected')) {
                        this.model.set('state', 'full');
                        dayCollection.reset([this.model]);
                    }

                    if (this.model.get('selected')) {
                        CalendarEvents.trigger('select:day');
                    }
                    else {
                        CalendarEvents.trigger('unselect:day', this.model.get('date'));
                    }

                    // Check if still selected after event:
                    if (this.model.get('selected')) {
                        lastClickedDay = this.model.get('date');
                    } else {
                        lastClickedDay = false;
                    }
                };
                e.preventDefault();
            }
        });

        Views.Week = Backbone.View.extend({

            tagName: 'td',
            className: 'week',

            events: {
                'click': 'clickWeek'
            },

            initialize: function (options) {
                this.weekNo = options.weekNo;
                if (!multiselect) {
                    this.$el.addClass('inactive');
                }
                this.render();
            },

            destroy: function () {
                this.remove();
                this.off();
            },

            clickWeek: function (e) {
                if (multiselect) {
                    var models = dayCollection.where({ weekNo: this.weekNo });
                    var selected = dayCollection.where({ 'selected': true });
                    if (e.shiftKey && selected.length > 0) {

                        var tempSelected = selected[0].get('date');
                        var current = models[0].get('date');

                        if (tempSelected.getTime() < current.getTime()) {
                            var current = models[models.length - 1].get('date');
                        }

                        var point1 = new Date(Math.min(tempSelected.getTime(), current.getTime()));
                        var point2 = Math.max(tempSelected.getTime(), current.getTime());

                        while (point1.getTime() <= point2) {
                            dayCollection.get(point1.getTime()).set('selected', true);
                            point1.dateAdd('+1 day');
                        };
                        CalendarEvents.trigger('select:range', dayCollection.where({ 'selected': true }));

                    } else {
                        var currentlySelected = dayCollection.where({ weekNo: this.weekNo, selected: true });
                        if (currentlySelected.length == models.length && (dayCollection.where({ selected: true }).length == 7 || e.ctrlKey)) {
                            _.each(models, function (model) {
                                model.set('selected', false);
                            });
                            if (currentlySelected.length > 1) {
                                CalendarEvents.trigger('unselect:range');
                            } else if (currentlySelected.length > 0) {
                                CalendarEvents.trigger('unselect:day', currentlySelected[0].date);
                            }

                        } else {
                            if (!e.ctrlKey) {
                                var currentlySelected = dayCollection.where({ 'selected': true });
                                _.each(currentlySelected, function (model) {
                                    model.set('selected', false);
                                });
                                if (currentlySelected.length > 1) {
                                    CalendarEvents.trigger('unselect:range');
                                } else if (currentlySelected.length > 0) {
                                    CalendarEvents.trigger('unselect:range');
                                }
                            };

                            _.each(models, function (model) {
                                model.set('selected', true);
                            });
                            CalendarEvents.trigger('select:range');
                        };
                    };
                    var currentlySelected = dayCollection.where({ 'selected': true });
                    lastClickedDay = false;
                    if (currentlySelected.length > 0) {
                        lastClickedDay = currentlySelected.pop().get('date');
                    };
                };
                e.preventDefault();
            },

            render: function () {
                this.$el.html(this.weekNo.split('-').pop());
                return this;
            }

        });

        Views.WeekDay = Backbone.View.extend({

            tagName: 'th',

            events: {
                'click': 'clickWeekDay'
            },

            initialize: function (options) {
                this.dayId = options.dayId || 0;
                this.monthId = options.monthId || 0;
                this.dayName = Locale.days.namesAbbr[this.dayId];
                this.render();
                if (!multiselect || disableWeekDayClick) {
                    this.$el.addClass('inactive');
                }
                return this;
            },

            destroy: function () {
                this.remove();
                this.off();
            },

            clickWeekDay: function (e) {
                if (disableWeekDayClick) {
                    return false;
                }
                if (multiselect) {

                    var models = dayCollection.where({ weekDayNr: this.dayId, monthId: this.monthId });

                    if (dayCollection.where({ weekDayNr: this.dayId, monthId: this.monthId, selected: true }).length == models.length) {
                        _.each(models, function (model) {
                            model.set('selected', false);
                        });
                        CalendarEvents.trigger('unselect:range');
                    } else {

                        if (!e.ctrlKey) {
                            var currentlySelected = dayCollection.where({ 'selected': true });
                            _.each(currentlySelected, function (model) {
                                model.set('selected', false);
                            });
                            if (currentlySelected.length > 1) {
                                CalendarEvents.trigger('unselect:range');
                            } else if (currentlySelected.length > 0) {
                                CalendarEvents.trigger('unselect:day', currentlySelected[0].date);
                            }
                        };

                        _.each(models, function (model) {
                            model.set('selected', true);
                        });
                        CalendarEvents.trigger('select:range');
                    };
                }
                e.preventDefault();
            },

            render: function () {
                this.$el.html(this.dayName);
                return this;
            }

        });

        Views.Month = Backbone.View.extend({

            tagName: 'table',
            weekdayView: Views.WeekDay,
            events: {},

            initialize: function (options) {
                this.$el.attr('unselectable', 'on');
                this.date = options.date || new Date();
                this.monthId = this.date.getMonth();
                this.caption = options.caption || Globalize.format(this.date, Locale.patterns.Y);
                this.render();
                return this;
            },

            destroy: function () {
                this.remove();
                this.off();
            },

            render: function () {
                var caption = $('<caption />').html(this.caption);
                this.$el.append(caption);

                var thead = this.renderThead();
                this.$el.append(thead);

                var tbody = this.renderTbody();
                this.$el.append(tbody);
                return this;
            },

            renderThead: function () {
                var row = $('<tr />');
                row.append('<th />');
                for (var i = 0; i < weekDayOrder.length; i++) {
                    row.append((new this.weekdayView({ dayId: weekDayOrder[i], monthId: this.date.getFullYear() + '-' + this.date.getMonth() })).$el);
                };
                var thead = $('<thead />');
                thead.append(row);
                return thead;
            },

            renderTbody: function () {
                var monthId = this.monthId;
                var row = null;
                var tbody = $('<tbody />');
                _.each(this.collection.models, function (model) {
                    if (model.get('weekDayNr') == startDay) {
                        if (row !== null) {
                            tbody.append(row);
                        }
                        row = $('<tr />');
                        row.append(new Views.Week({ weekNo: model.get('weekNo') }).$el);
                    }
                    row.append(new Views.Day({ model: model, monthId: monthId }).$el);
                });
                tbody.append(row);
                return tbody;
            }

        });

        Views.Control = Backbone.View.extend({
            tagName: 'div',
            events: {
                'click .left-arrow': 'clickLeft',
                'click .right-arrow': 'clickRight'
            },

            initialize: function (options) {
                options = options || {};
                this.navigation = options.navigation || false;
                this.render();
                this.currentDate = options.currentDate;
                this.scroolToFullState = options.scroolToFullState;
                this.drawVisibleMonths();
                this.el.onselectstart = function (e) { return false; }
                this.h_toggle = $.proxy(this.toggleCalendar, this);
                this.h_hide = $.proxy(this.hideCalendar, this);
                if (popupAnchor) {
                    $(popupAnchor).on('click', this.h_toggle);
                    $(document).on('click', this.h_hide);
                }
            },

            destroy: function () {
                $(popupAnchor).off('click', this.h_toggle);
                $(document).off('click', this.h_hide);
                this.remove();
                this.off();
            },

            render: function () {
                this.$el.addClass('adform-calendar-v2').addClass('adform-calendar-' + calendarType).append('<div class="placeholder" />');
                this.$placeholder = this.$el.find('.placeholder');
                if (this.navigation) {
                    this.$el.addClass('with-navigation');
                    this.$placeholder.append('<a class="left-arrow"></a>').append('<a class="right-arrow"></a>');
                };

                if (picker) {
                    this.$el.addClass('popup');
                    this.$el.removeClass('with-navigation');
                }
            },

            drawVisibleMonths: function () {
                var cDate = new Date(this.currentDate);
                cDate.setHours(12, 0, 0, 0);
                this.$placeholder.find('table').remove();

                if (cDate.getTime() <= displayPeriodStart) {
                    this.$el.find('.left-arrow').addClass('disabled')
                } else {
                    this.$el.find('.left-arrow').removeClass('disabled')
                }

                for (var i = 0; i < displayMonths; i++) {
                    this.$placeholder.append(new Views.Month({ date: cDate, collection: period2daysCollection(cDate) }).$el);
                    cDate.dateAdd('+1 month');
                }

                if (cDate.getTime() >= displayPeriodEnd) {
                    this.$el.find('.right-arrow').addClass('disabled')
                } else {
                    this.$el.find('.right-arrow').removeClass('disabled')
                }

            },

            clickLeft: function (e) {
                if (this.$el.find('.left-arrow').hasClass('disabled')) {
                    return;
                };
                this.currentDate.dateAdd('-' + scrollAmmount + 'mon');
                if (this.currentDate < displayPeriodStart) {
                    this.currentDate = new Date(displayPeriodStart);
                }
                this.drawVisibleMonths();
            },

            clickRight: function (e) {
                if (this.$el.find('.right-arrow').hasClass('disabled')) {
                    return;
                };

                this.currentDate.dateAdd('+' + scrollAmmount + 'mon')

                var checkDate = new Date(this.currentDate)
                checkDate.dateAdd('+' + scrollAmmount + 'mon');

                if (checkDate.getTime() > displayPeriodEnd) {
                    this.currentDate = new Date(displayPeriodEnd);
                    this.currentDate.dateAdd('-' + scrollAmmount + 'mon')
                }
                this.drawVisibleMonths();
            },

            toggleCalendar: function (event) {
                if (this.$el.is(':visible') && event.target.nodeName.toLowerCase() === 'input') {
                    return;
                }
                var $popupAnchor = $(popupAnchor);
                var zIndex = parseInt($popupAnchor.parents().filter(function () {
                    return $(this).css('z-index') != 'auto';
                }).first().css('z-index')) + 10;
                var offset = $popupAnchor.offset();
                this.scrollToSelected();

                var isVisible = this.$el.is(':visible');

                if (popup) {
                    this.$el.parents('.tooltip')
                        .css({
                            top: offset.top + $popupAnchor.height(),
                            left: offset.left - 5,
                            zIndex: zIndex
                        })
                        .toggle();
                } else {
                    this.$el.parents('.tooltip')
                        .css({
                            top: offset.top + $popupAnchor.height(),
                            left: offset.left - this.$el.parents('.tooltip').width() + $popupAnchor.width() + 5,
                            zIndex: zIndex
                        })
                        .toggle();
                }

                if (isVisible) {
                    CalendarEvents.trigger('closed');
                } else {
                    CalendarEvents.trigger('opened');
                }
            },

            hideCalendar: function (event) {
                event.stopPropagation();
                if (this.isClickedOutsideControl(event) && this.$el.is(':visible')) {
                    this.$el.parents('.tooltip').hide();
                    this.scrollToSelected();
                    CalendarEvents.trigger('closed');
                }
            },

            isClickedOutsideControl: function (event) {
                return $(event.target).parents(popupAnchor + ',' + container + ',.tooltip').length === 0;
            },

            scrollToSelected: function () {

                var firstFullStateDate = dayCollection.find(function (currentModel) {
                    return currentModel.get("state") === "full";
                });


                if (this.scroolToFullState && firstFullStateDate) {
                    this.currentDate = new Date(firstFullStateDate.get("date").getTime());

                } else {
                    this.currentDate = new Date(dayCollection.models[0].get('date').getTime());
                }

                this.drawVisibleMonths();
            }
        });


        /* End of good stuff... */
        var calculateMonthStartEnd = function (dateObject) {
            var periodStart = new Date(dateObject);
            periodStart.setDate(1);
            periodStart.setHours(12, 0, 0, 0);
            var periodEnd = new Date(periodStart);
            periodEnd.dateAdd('+1 month');

            while (periodStart.getDay() != startDay) {
                periodStart.dateAdd('-1 day');
            }

            while (periodEnd.getDay() != startDay) {
                periodEnd.dateAdd('+1 day');
            }

            return [periodStart, periodEnd];
        };

        var dayCollection = new Collections.Days();

        if (!duration) {
            var currentDate = new Date(inViewDay);
            currentDate.setHours(12, 0, 0, 0);

            dayCollection.add(
                new Models.Day({
                    date: new Date(currentDate),
                    monthId: currentDate.getFullYear() + '-' + currentDate.getMonth(),
                    id: currentDate.getTime(),
                    state: 'none',
                    selected: false,
                    disabled: false,
                    weekNo: currentDate.getFullYear() + '-' + currentDate.getWeekNumber(),
                    weekDayNr: currentDate.getDay()
                })
            );
        } else {

            /* Normalize period range */
            var displayPeriodStart = new Date(duration[0]);
            displayPeriodStart.setHours(12, 0, 0, 0);

            var displayPeriodEnd = new Date(duration[1]);
            displayPeriodEnd.setHours(12, 0, 0, 0);

            var currentDate = new Date(displayPeriodStart);
            var weekId = 0;

            displayPeriodStart.setDate(1);

            var whileRangeEnd = displayPeriodEnd.getTime();

            var prevWeekDayId = {};
            var weekDayId = '';
            var tempWeekDaySequenceId = 0;
            var tempWeekNo;

            while (currentDate.getTime() <= whileRangeEnd) {
                weekDayId = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDay();
                tempWeekNo = currentDate.getFullYear() + '-' + currentDate.getWeekNumber();
                if (currentDate.getMonth() == 0 && currentDate.getWeekNumber() != 1 && currentDate.getWeekNumber() > 50) {
                    tempWeekNo = (currentDate.getFullYear() - 1) + '-' + currentDate.getWeekNumber();
                } else if (currentDate.getMonth() == 11 && currentDate.getWeekNumber() == 1) {
                    tempWeekNo = (currentDate.getFullYear() + 1) + '-' + currentDate.getWeekNumber();
                }
                if (typeof (prevWeekDayId[weekDayId]) == 'undefined') {
                    prevWeekDayId[weekDayId] = tempWeekDaySequenceId;
                    tempWeekDaySequenceId++;
                };
                dayCollection.add(
                    new Models.Day({
                        date: new Date(currentDate),
                        monthId: currentDate.getFullYear() + '-' + currentDate.getMonth(),
                        id: currentDate.getTime(),
                        state: 'none',
                        selected: false,
                        disabled: false,
                        weekNo: tempWeekNo,
                        weekDayNr: currentDate.getDay(),
                        weekDaySequenceId: prevWeekDayId[weekDayId]
                    })
                );
                currentDate.dateAdd('+1 day');
            }
        };

        var period2daysCollection = function (dateObject) {
            var tmpPeriod = calculateMonthStartEnd(dateObject);
            var periodStart = tmpPeriod[0];
            var periodEnd = tmpPeriod[1];
            var periodDayCollection = new Collections.Days();
            var dateId;
            var whileRangeEnd = periodEnd.getTime();
            var tempWeekNo;
            while (periodStart.getTime() < whileRangeEnd) {
                dateId = periodStart.getTime();
                if (dayCollection.get(dateId)) {
                    periodDayCollection.add(dayCollection.get(dateId));
                } else {
                    tempWeekNo = periodStart.getFullYear() + '-' + periodStart.getWeekNumber();
                    if (periodStart.getMonth() == 0 && periodStart.getWeekNumber() != 1 && periodStart.getWeekNumber() > 50) {
                        tempWeekNo = (periodStart.getFullYear() - 1) + '-' + periodStart.getWeekNumber();
                    } else if (periodStart.getMonth() == 11 && periodStart.getWeekNumber() == 1) {
                        tempWeekNo = (periodStart.getFullYear() + 1) + '-' + periodStart.getWeekNumber();
                    }
                    if (duration) {
                        periodDayCollection.add(
                            new Models.Day({
                                date: new Date(periodStart),
                                id: dateId,
                                state: 'none',
                                selected: false,
                                disabled: dateId < duration[0].getTime() || dateId > duration[1].getTime(),
                                weekNo: tempWeekNo,
                                weekDayNr: periodStart.getDay()
                            })
                        );
                    } else {
                        periodDayCollection.add(
                            new Models.Day({
                                date: new Date(periodStart),
                                id: dateId,
                                state: 'none',
                                selected: false,
                                disabled: false,
                                weekNo: tempWeekNo,
                                weekDayNr: periodStart.getDay()
                            })
                        );
                    }
                };
                periodStart.dateAdd('+1 day');
            }
            return periodDayCollection;
        };

        var CalendarEvents = _.extend({}, Backbone.Events);
        CalendarEvents.on('all', function () {
            $(this).trigger('AdformCalendar:' + arguments[0], arguments);
        }, this);

        var d = new Date(displayPeriodStart);

        this.deselectAll = function () {
            _.each(dayCollection.where({ selected: true }), function (model) {
                model.set('selected', false);
                if (!multiselect) {
                    model.set('state', 'none');
                }
            });
            return true;
        }

        this.selectRange = function (start, end) {

            this.deselectAll();

            start = new Date(start);
            end = new Date(end);

            if (start.getFullYear() < 2000) {
                start.setYear(2000);
            };

            if (end.getFullYear() > 2050) {
                en.setYear(2050);
            }

            start.setHours(12, 0, 0, 0);
            end.setHours(12, 0, 0, 0);

            var point1 = new Date(Math.min(start.getTime(), end.getTime()));
            var point2 = Math.max(start.getTime(), end.getTime());

            while (point1.getTime() <= point2) {

                if (!dayCollection.get(point1.getTime())) {
                    point1.dateAdd('+1 day');
                    continue;
                };

                if (!dayCollection.get(point1.getTime()).get('disabled')) {
                    dayCollection.get(point1.getTime()).set('selected', true);
                };
                point1.dateAdd('+1 day');
            };
            CalendarEvents.trigger('select:range');
            return dayCollection.where({ selected: true }).length > 0;
        };

        this.unsetAllDays = function () {
            dayCollection.invoke('set', {
                state: 'none'
            });
        }

        this.select = function (dayIds) {

            var coll = dayCollection.where({ selected: true });
            _.each(coll, function (model) {
                model.set('selected', false);
                if (!multiselect) {
                    model.set('state', 'none');
                }
            });

            if (!(dayIds instanceof Array)) {
                dayIds = [dayIds];
            };

            _.each(dayIds, function (dayId) {

                dayId = new Date(dayId).setHours(12, 0, 0, 0);

                if (multiselect) {
                    var dayModel = dayCollection.get(dayId);
                    if (!dayModel || dayModel.get('disabled')) {
                        return false;
                    };

                    dayModel.set('selected', true);
                } else {
                    var dayDate = new Date(dayId);
                    if (dayDate.getFullYear() > 1970) {
                        dayDate.setHours(12, 0, 0, 0);
                        var newSelectedDate = new Models.Day({
                            date: dayDate,
                            id: dayId,
                            state: 'full',
                            selected: true,
                            disabled: false,
                            weekNo: dayDate.getFullYear() + '-' + dayDate.getWeekNumber(),
                            weekDayNr: dayDate.getDay()
                        });
                        dayCollection.reset([newSelectedDate]);
                        Control.currentDate = new Date(newSelectedDate.get('date'));
                        Control.drawVisibleMonths();
                        CalendarEvents.trigger('select:day');
                    }
                }
            });
            return true;
        };

        this.expandSelection = function (type, forFullDuration) {
            var model = dayCollection.where({ selected: true })[0];
            var coll = [];
            if (type == 'week') {
                coll = dayCollection.where({ disabled: false, weekNo: model.get('weekNo'), selected: false });
            } else if (type == 'weekday') {
                if (forFullDuration) {
                    coll = dayCollection.where({ disabled: false, weekDayNr: model.get('weekDayNr'), selected: false });
                } else {
                    coll = dayCollection.where({ disabled: false, monthId: model.get('monthId'), weekDayNr: model.get('weekDayNr'), selected: false });
                }
            };

            if (coll.length > 0) {
                _.each(coll, function (model) {
                    model.set('selected', true);
                });
                CalendarEvents.trigger('select:range');
            }
        };

        this.setState = function (state, dayId1, dayId2) {
            if (typeof (state) == 'undefined') {
                return false;
            };

            var state = state;
            if (typeof (dayId2) == 'undefined' && typeof (dayId1) != 'undefined') {

                if (typeof (dayId1) != 'object') {
                    dayId1 = [dayId1];
                };
                var tempDate, dayModel;
                for (var i = 0; i < dayId1.length; i++) {
                    tempDate = new Date(dayId1[i]);
                    tempDate.setHours(12, 0, 0, 0);
                    dayModel = dayCollection.get(tempDate.getTime());
                    if (!dayModel || dayModel.get('disabled')) {
                        return false;
                    };
                    dayModel.set('state', state);
                }


            } else if (typeof (dayId2) != 'undefined') {


                start = new Date(dayId1);
                end = new Date(dayId2);

                if (start.getFullYear() < 2000) {
                    start.setYear(2000);
                };

                if (end.getFullYear() > 2050) {
                    en.setYear(2050);
                }

                start.setHours(12, 0, 0, 0);
                end.setHours(12, 0, 0, 0);

                var point1 = new Date(Math.min(start.getTime(), end.getTime()));
                var point2 = Math.max(start.getTime(), end.getTime());

                while (point1.getTime() <= point2) {

                    if (!dayCollection.get(point1.getTime())) {
                        point1.dateAdd('+1 day');
                        continue;
                    };

                    if (!dayCollection.get(point1.getTime()).get('disabled')) {
                        dayCollection.get(point1.getTime()).set('state', state);
                    };
                    point1.dateAdd('+1 day');
                };


            } else {

                var coll = dayCollection.where({ selected: true });

                if (coll.length == 0) {
                    return false;
                }

                _.each(coll, function (model) {
                    model.set('state', state);
                });
            };

            CalendarEvents.trigger('change:state');
            if (deselectOnChange) {
                this.deselectAll();
            };
            return true;
        };

        this.getSelected = function (groupRanges) {
            groupRanges = groupRanges || false;
            var models = dayCollection.where({ selected: true });
            if (models.length == 0) {
                return false;
            }
            var days = [];
            if (groupRanges) {
                var ranges = [];
                var dateObj;
                for (var i = 0; i < models.length; i++) {
                    dateObj = models[i].get('date');
                    if (days.length == 0) {
                        days.push(dateObj);
                    } else {
                        var diff = dateObj.getTime() - days[days.length - 1].getTime();
                        if (diff > valDay + valHour * 2) {
                            ranges.push(days);
                            days = [];
                        };
                        days.push(dateObj);
                    }
                };
                ranges.push(days);
                return ranges;
            } else {
                for (var i = 0; i < models.length; i++) {
                    days.push(models[i].get('date'));
                };
                return days;
            };
        };

        this.getSelectedRanges = function () {
            return this.getSelected(true);
        };

        this.destroy = function () {
            CalendarEvents.off();
            dayCollection.off();

            dayCollection.each(function (model) {
                model.off();
                model = null;
            });

            Control.destroy();
        };

        var Control = new Views.Control({ navigation: true, currentDate: inViewDay, scroolToFullState: scroolToFullState });

        if (popup) {
            var $tooltip = $('<div>').appendTo(container).addClass('tooltip info bottom-left in hide');
            $('<div>').appendTo($tooltip).addClass('tooltip-arrow');
            $('<div>').appendTo($tooltip).addClass('tooltip-arrow over');
            $('<div>').appendTo($tooltip).addClass('tooltip-inner').prepend(Control.$el);
        } else {
            $(container).prepend(Control.$el);
        }
    };

    window.Adform = window.Adform || {};
    window.Adform.Calendar = Calendar;
})(jQuery);