define('ComponentCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'Config'
], function ($, _, Backbone, Component, Config) {
    var ComponentCollection;

    ComponentCollection = Backbone.Collection.extend({
        model: Component,
        url: Config.ComponentSettings.URL
    });

    return ComponentCollection;
});