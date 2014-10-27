define('Dashboard', [
    'jquery',
    'underscore',
    'backbone',
    'DashboardComponentCollection',
    'Config'
], function ($, _, Backbone, DashboardComponentCollection, Config) {
    var Dashboard = Backbone.Model.extend({
        urlRoot: Config.DashboardSettings.URL,

        idAttribute: "Id",

		defaults: function() {
		    this.set({
		        Title: "",
		        ComponentIds: [],
                Components: []
		    });
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

    return Dashboard;
});