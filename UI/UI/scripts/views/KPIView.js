define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
], function(BaseCompositeView, KPITemplate) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        render: function() {
            this.$el.html(this.template({
                "Metrics": this.model.get('Metrics'),
                "model": this.model.toJSON()
            }));

            return this;
        }

    });


    return KPIView;
});