define('ComponentGeneratedView', [
    'BaseCompositeView',
    'Component',
    'Metric',
    'MetricCollection',
    'text!templates/kpi.html',
    'text!templates/table.html',
    'text!templates/timeline.html',
    'text!templates/chart.html'
], function (BaseCompositeView, Component, Metric, MetricCollection, KPITemplate, TableTemplate, TimelineTemplate, ChartTemplate) {

    var ComponentGeneratedView = BaseCompositeView.extend({
        model: new Component,

        events: {
        },

        initialize: function (parentModel) {
            this.model = parentModel;
            this.collection = new MetricCollection(parentModel.get("Metrics"));
        },

        render: function () {
            var tpl;
            switch (this.model.get("Type")) {
                case 0:
                    tpl = KPITemplate;
                    break;
                case 1:
                    tpl = KPITemplate;
                    break;
                case 2:
                    tpl = TableTemplate;
                    break;
                case 3:
                    tpl = TimelineTemplate;
                    break;
                case 4:
                    tpl = ChartTemplate;
                    break;
                default:
                    tpl = KPITemplate;
            }

            var template = _.template(tpl);

            this.$el.html(template({
                "Metrics": this.collection.toJSON(),
                "model": this.model.toJSON()
            })); // Render Metric list      
        },
    });

    return ComponentGeneratedView;
});