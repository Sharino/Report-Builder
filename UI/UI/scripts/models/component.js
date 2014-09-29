define('Component', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Component;

    Component = Backbone.Model.extend({
        urlRoot: "http://37.157.0.42:33895/api/ReportComponent",
        idAttribute: "Id",
		defaults: {
            Title: "",
			Type: 0,
			Metrics: [],
			Dimensions: [],
			Filters: []
		},
		validate: function (attrs) {
            // TODO: use Backbone.validateAll
		    var errors = this.errors = {};

		    if (!attrs.Title) errors.Title = 'Title is required';
		    if (!attrs.Type) errors.Type = 'Type is required';

		    if (!_.isEmpty(errors)) return errors;
		}
    });

    return Component;
});