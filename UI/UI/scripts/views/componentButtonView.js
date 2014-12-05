define('ComponentButtonView', [
    'BaseCompositeView',
    'text!templates/componentButtons.html'
], function (BaseCompositeView, ButtonTemplate) {
    var ComponentButtons = BaseCompositeView.extend({
        template: _.template(ButtonTemplate),

        initialize: function (position, model, origin) {
            this.model = model;
            this.position = position - 1; 
            this.origin = origin;
        },

        render: function () {
            this.$el.html(this.template({
                Origin: this.origin,
                Position: this.position,
                model: this.model,
            }));
            return this;
        },
    });

    return ComponentButtons;
});