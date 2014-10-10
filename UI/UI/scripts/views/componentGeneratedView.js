define('ComponentGeneratedView', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'Metric',
    'MetricCollection',
    'text!templates/kpi.html',
    'text!templates/table.html',
    'text!templates/timeline.html',
    'text!templates/chart.html',

], function ($, _, Backbone, Component, Metric, MetricCollection,
             KPITemplate, TableTemplate, TimelineTemplate, ChartTemplate) {

    var ComponentGeneratedView;

    ComponentGeneratedView = Backbone.View.extend({
        model: new Component,

        events: {
        },

        initialize: function () {
            if (!this.model) {
                this.collection = new MetricCollection();
            } else {
                this.collection = new MetricCollection(this.collection);
            }
        },

        render: function () {
            // DEBUG: Sorting might not be required later as we implement features.
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