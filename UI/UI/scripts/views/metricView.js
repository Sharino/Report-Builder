define('MetricView', [
    'jquery',
    'underscore',
    'backbone',
    'Metric',
    'adform-notifications'
], function ($, _, Backbone, Metric, AdformNotification) {
    var MetricView;

    MetricView = Backbone.View.extend({
        template: _.template($("#metric-template").html()),

        render: function () {
            console.log("MetricView.render() fired.", this.template());
            this.$el.html(this.template());
        }
    });

    return MetricView;
});