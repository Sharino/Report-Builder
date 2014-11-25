define('Dashboard', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
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
		        errors.push({ code: 621, name: 'Title', message: 'Title is required.' });
		    }
		    else {
		        if (attrs.Title.length < 3) {
		            errors.push({ code: 622, name: 'Title', message: 'Title is too short.' });
		        }
		        if (attrs.Title.length > 30) {
		            errors.push({ code: 623, name: 'Title', message: 'Title is too long.' });
		        }
		    }

		    if (!_.isEmpty(errors)) return errors;
		}
    });

    return Dashboard;
});