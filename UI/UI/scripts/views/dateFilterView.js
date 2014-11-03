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

                var datePickerChangeCallback = function(e) {
                    console.log(e, $("#picker").find("input"));
                };

                $(datePicker).on("AdformDatePicker:change", datePickerChangeCallback);
                $(datePicker2).on("AdformDatePicker:change", datePickerChangeCallback);

            });
        }
    });

    return DateFilterView;
});