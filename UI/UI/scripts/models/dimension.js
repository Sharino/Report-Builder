define('Dimension', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var Dimension = Backbone.Model.extend({
        idAttribute: "DimensionId",

        urlRoot: Config.DimensionSettings.URL,

        defaults: function () {
            this.set({
            });
        },

        toString: function () {
            return this.DisplayName;
        }
    });

    return Dimension;
});