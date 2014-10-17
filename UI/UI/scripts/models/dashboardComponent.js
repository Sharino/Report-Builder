define('DashboardComponent', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var DashboardComponent = Backbone.Model.extend({
        urlRoot: Config.DashboardComponentSettings.URL,
        idAttribute: "Id",
        defaults: {
            Title: "",
            Type: 1,
            Metrics: [],
            Dimensions: [],
            Filters: []
        },

        validate: function (attrs) {
            var errors = this.errors = [];

            if (!attrs.Title) {
                errors.push({ name: 'Title', message: 'Title is required' });
            } else if (attrs.Title.length < 3) {
                errors.push({ name: 'Title', message: 'Title is shorter than 3 symbols' });
            }

            if (!_.isEmpty(errors)) return errors;
        }
    });

    return DashboardComponent;
});