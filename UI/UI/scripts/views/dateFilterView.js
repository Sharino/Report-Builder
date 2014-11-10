define('DateFilterView', [
    'BaseCompositeView',
    'text!templates/dateFilter.html',
    'adform-datepicker'
], function (BaseCompositeView, dateFilterTemplate) {
    var DateFilterView = BaseCompositeView.extend({
        template: _.template(dateFilterTemplate),

        render: function () {
            this.$el.html(this.template);

            this.initializeDateFilter();
        },

        initializeDateFilter: function () {
            _.defer(function () {
                var pickerOptions = {
                    pickerControl: '#picker',
                };

                var pickerOptions2 = {
                    pickerControl: '#picker2',
                    optionalField: true
                };

                var date = _.template(dateFilterTemplate);

                var AdformDatePicker = window.Adform.DatePicker;
                var datePicker = new AdformDatePicker(pickerOptions);
                var datePicker2 = new AdformDatePicker(pickerOptions2);

                //                this.$el.html(date(datePicker));
                //                this.$el.html(date(datePicker2));
            });
        }

    });

    return DateFilterView;
});