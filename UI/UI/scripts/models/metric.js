define('Metric', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Metric;

    Metric = Backbone.Model.extend({
        // TODO: Add urlRoot for Metric API.
        defaults: {
            DisplayName: "Test Metric"
        }
    });

    return Metric;
});