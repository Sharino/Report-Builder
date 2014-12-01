define('Metric', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var Metric = Backbone.Model.extend({
        idAttribute: "MetricId",

        urlRoot: Config.MetricSettings.URL,

        defaults: function () {
            this.set({
            });
        },

        toString: function () {
            return this.DisplayName;
        }
    });

    return Metric;
});