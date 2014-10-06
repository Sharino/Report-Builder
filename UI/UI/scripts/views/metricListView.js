define('MetricListView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var MetricListView;

    MetricListView = Backbone.View.extend({
        tagName: "li",

    });

    return MetricListView;
});