define('MetricCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Metric',
    'Config'
], function ($, _, Backbone, Metric, Config) {
    var MetricCollection;

    MetricCollection = Backbone.Collection.extend({
        model: Metric,
        comparator: 'Order',
        url: Config.MetricSettings.URL
    });

    return MetricCollection;
});