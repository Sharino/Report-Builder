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

        events: {
            'click #addMetric': 'addMetric',
        },

        initialize: function () {
            this.collection = new MetricCollection();
            this.collection.on('add', this.render, this);
        },

        render: function () {
            this.$el.html(this.template({ "Metrics": this.collection.toJSON() }));
        },

        addMetric: function () {
            this.collection.add([
               { Title: "Metric" + this.collection.length }
            ]);

            console.log(this, this.collection.toJSON());
        }
    });

    return MetricListView;
});