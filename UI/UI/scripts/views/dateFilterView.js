define('DateFilterView', [
   'BaseCompositeView',
   'text!templates/dateFilter.html',
   'adform-datepicker'
], function (BaseCompositeView, dateFilterTemplate) {
    var DateFilterView = BaseCompositeView.extend({
        template: _.template(dateFilterTemplate),

        initialize: function (options) {
            this.options = options;

            ; _.defer(function () {
                var pickerOptions = {
                    pickerControl: '#picker',
                };

                var pickerOptions2 = {
                    pickerControl: '#picker2',
                    optionalField: true
                };

                var AdformDatePicker = window.Adform.DatePicker;
                var datePicker = new AdformDatePicker(pickerOptions);
                var datePicker2 = new AdformDatePicker(pickerOptions2);

<<<<<<< HEAD
         
=======
//                var datePickerChangeCallback = function(e) {
//                    console.log(e, $("#picker").find("input"));
//                };

                $(datePicker).on("AdformDatePicker:change", datePickerChangeCallback);
                $(datePicker2).on("AdformDatePicker:change", datePickerChangeCallback);

>>>>>>> origin/master
            });
            this.render(options);
        },

        render: function (options) {
            var date;
<<<<<<< HEAD

=======
            
>>>>>>> origin/master
            if (!options) {
                date = this.options;
            } else {
                date = options;
            }

            this.$el.html(this.template({ options: date }));
        }

    });

    return DateFilterView;
});