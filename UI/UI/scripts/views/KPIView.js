define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
    'DateFilterView'
], function (BaseCompositeView, KPITemplate, DateFilterView) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        initialize: function (parent, pos) {
            this.model = parent;
            this.position = pos;
        },

        render: function () {
            this.$el.html(this.template({
                Metrics: this.model.get('Metrics'),
                model: this.model.toJSON(),
                Position: this.position || 0
            }));

            this.renderSubview("#date-filter", new DateFilterView());

            return this;
        }
    });


    return KPIView;
});


/*define('KPIView', [
    'BaseCompositeView',
    'text!templates/kpi.html',
    'DateFilterView'
], function (BaseCompositeView, KPITemplate, DateFilterView) {

    var KPIView = BaseCompositeView.extend({
        template: _.template(KPITemplate),

        initialize: function (parent, pos) {
            this.parent = parent;
            this.position = pos;
        },

        render: function() {
            this.$el.html(this.template({
                "Metrics": this.parent.get('Metrics'),
                "model": this.parent.toJSON()
            }));
            this.$el.html(this.template({ Position: this.position }));
            this.renderSubview("#date-filter", new DateFilterView());

            return this;
        }
    });
    return KPIView;
});*/