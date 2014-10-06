define('MetricListView', [
    'jquery',
    'underscore',
    'backbone',
    'Sortable',
    'Metric',
    'MetricCollection',
    'text!templates/metricList.html',

], function ($, _, Backbone, Sortable, Metric, MetricCollection, MetricListTemplate) {
    var MetricListView;

    MetricListView = Backbone.View.extend({
        template: _.template(MetricListTemplate),
        collection: new MetricCollection(),

        render: function () {
            this.collection.add([
               { Title: "Metric 1" },
               { Title: "Black Pearl" }
            ]);
            this.$el.html(this.template({ "Metrics": this.collection.toJSON() }));
        }
    });

    return MetricListView;
});