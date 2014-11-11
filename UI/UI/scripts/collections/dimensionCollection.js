define('DimensionCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Dimension',
    'Config'
], function ($, _, Backbone, Dimension, Config) {
    var DimensionCollection;

    DimensionCollection = Backbone.Collection.extend({
        model: Dimension,
        comparator: 'Order',
        url: Config.DimensionSettings.URL
    });

    return DimensionCollection;
});