define('ComponentCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Component'
], function ($, _, Backbone, Component) {
    var ComponentCollection;

    ComponentCollection = Backbone.Collection.extend({
        model: Component,
        url: "http://37.157.0.42:33895/api/ReportComponent"
    });

    return ComponentCollection;
});