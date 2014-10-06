define('MetricCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Metric'
], function ($, _, Backbone, Metric) {
    var MetricCollection;

    MetricCollection = Backbone.Collection.extend({
        model: Metric
		// TODO: Add URL for Metric API.
    });

    return MetricCollection;
});