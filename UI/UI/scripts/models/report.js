define('Report', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Report;

    Report = Backbone.Model.extend({
        idAttribute: "Id",
		defaults: {
            Title: "",
			Type: 0,
			Metrics: [],
			Dimensions: [],
			Filters: []
        },
        urlRoot: "http://37.157.0.42:33895/api/ReportComponent"
    });

    return Report;
});