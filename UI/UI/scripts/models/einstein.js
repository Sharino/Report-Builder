define('Einstein', [
   'jquery',
   'underscore',
   'backbone',
   'Config'
], function ($, _, Backbone, Config) {
    var Einstein = Backbone.Model.extend({
        urlRoot: Config.EinsteinSettings.URL,// + JSON.stringify(this.Metrics + this.Dimensions + this.Filters),
        idAttribute: "Id",
        defaults: {
            Metrics: [],
            Dimensions: [],
        },
    });

    return Einstein;
});