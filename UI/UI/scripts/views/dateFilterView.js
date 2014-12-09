define('DateFilterView', [
   'BaseCompositeView',
   'text!templates/dateFilter.html',
   'adform-datepicker',
   'adform-calendar',
   'adform-date',
   'adform-range-selector',
   'handlebars-tpl'
], function (BaseCompositeView, dateFilterTemplate) {
    var DateFilterView = BaseCompositeView.extend({
        template: _.template(dateFilterTemplate),

        initialize: function (options) {

        },

        render: function (options) {
            //            var date;
            //
            //            if (!options) {
            //                date = this.options;
            //            } else {
            //                date = options;
            //            }
            //
            //            this.$el.html(this.template({ options: date }));


            this.$el.html(this.template());

            _.defer(function () {
                var endDate = new Date();
                endDate.dateAdd('+10 day');

                var rangeSelectorOptions = {
                    rangeControl: '#range-selector',
                    rangeStart: new Date(),
                    rangeEnd: endDate,
                    minAllowedRangeDate: new Date(2012, 5, 5),
                    maxAllowedRangeDate: new Date(2014, 5, 5),
                    monthMode: false,
                    dateFormat: "YYYY-MM-DD"
                };

                window.RangeSelectorInstance = new Adform.RangeSelector(rangeSelectorOptions);
                var a = window.RangeSelectorInstance;
                console.log(a.getRangeStartDate(), a.getRangeEndDate());
            });
        }

    });

    return DateFilterView;
});