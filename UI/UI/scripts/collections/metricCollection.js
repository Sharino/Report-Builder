define('MetricCollection', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var MetricCollection;

    MetricCollection = Backbone.Collection.extend({
        model: Metric
		// TODO: Add URL for Metric API.
    });

    return MetricCollection;
});