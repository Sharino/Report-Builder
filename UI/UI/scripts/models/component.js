define('Component', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Component;

    Component = Backbone.Model.extend({
        defaults: {
            title: "Unnamed Component",
            id: "",
            metrics: {},
            dimensions: {}
        },
        url: "http://37.157.0.42:33895/api/ReportComponent"
    });

    return Component;
});