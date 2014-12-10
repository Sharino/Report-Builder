define('DateFilterView', [
  'BaseCompositeView',
  'text!templates/dateFilter.html',
  'adform-datepicker'
], function (BaseCompositeView, dateFilterTemplate) {
    var DateFilterView = BaseCompositeView.extend({
        template: _.template(dateFilterTemplate),

        initialize: function (options, pos, origin) {
            this.options = options;
            this.position = pos - 1;
            this.origin = origin;
        },

        beforeClose: function () {
            this.datePicker.destroy();
            this.datePicker2.destroy();
        },

        render: function (options) {
            var date;
            if (!options) {
                date = this.options;
            } else {
                date = options;
            }

            this.$el.html(this.template({ options: date, position: this.position, origin: this.origin }));

            var self = this;
            var pickerOptions = {
                pickerControl: '#picker-' + self.position,
            };

            var pickerOptions2 = {
                pickerControl: '#picker2-' + self.position
            };

            var AdformDatePicker = window.Adform.DatePicker;
            _.defer(function () {
                self.datePicker = new AdformDatePicker(pickerOptions);
                self.datePicker2 = new AdformDatePicker(pickerOptions2);
            });

            return this;
        }
    });

    return DateFilterView;
});