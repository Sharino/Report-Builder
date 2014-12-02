define('ComponentButtonView', [
    'BaseCompositeView',
    'text!templates/componentButtons.html'
], function (BaseCompositeView, ButtonTemplate) {
    var ComponentButtons = BaseCompositeView.extend({
        template: _.template(ButtonTemplate),

        initialize: function (position, model, dashboard) {
            this.model = model;
            this.position = position - 1; 
            this.originDashboard = dashboard;

            console.log("buttonview", this.model);
            console.log("buttonview", this.position);
            console.log("buttonview", this.originDashboard);
        },

        render: function () {
            this.$el.html(this.template({
                Dashboard: this.originDashboard,
                Position: this.position,
                model: this.model,
            }));
            return this;
        },
    });

    return ComponentButtons;
});