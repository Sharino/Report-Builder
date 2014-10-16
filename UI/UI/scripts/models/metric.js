define('Metric', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var Metric;

    Metric = Backbone.Model.extend({
        idAttribute: "MetricId",

        urlRoot: Config.MetricSettings.URL,

        toString: function () {
            return this.DisplayName;
        }
    });

    return Metric;
});