﻿define('Component', [
    'jquery',
    'underscore',
    'backbone',
<<<<<<< HEAD
    'Config',
    'MetricCollection'
], function ($, _, Backbone, Config, MetricCollection) {
    var Component;

    Component = Backbone.Model.extend({
        urlRoot: Config.ComponentSettings.ComponentURL,
        idAttribute: "Id",
		defaults: {
            Title: "",
			Type: 0,
=======
    'Config'
], function ($, _, Backbone, Config) {
    var Component = Backbone.Model.extend({
        urlRoot: Config.ComponentSettings.URL,
        idAttribute: "Id",
		defaults: {
            Title: "",
			Type: 1,
<<<<<<< HEAD
			Metrics: [],
>>>>>>> origin/MetricComponent
=======
>>>>>>> a680b101fdc86ebb544f3e994937332453256c37
			Dimensions: [],
			Filters: []
		},

<<<<<<< HEAD
		initialize: function(){
		    this.Metrics = new MetricCollection();
		},

=======
>>>>>>> origin/MetricComponent
		validate: function (attrs) {
		    var errors = this.errors = [];

		    if (!attrs.Title) {
		        errors.push({ name: 'Title', message: 'Title is required' });
		    } else if (attrs.Title.length < 3) {
		        errors.push({ name: 'Title', message: 'Title is shorter than 3 symbols' });
		    }

		    if (!attrs.Type || attrs.Type === 0) {
		        errors.push({ name: 'Type', message: 'Type is required' });
		    }
		    if (attrs.Metrics.length === 0) {
		        errors.push({ name: 'Metrics', message: 'At least one metric is required.' });
		    }

		    if (!_.isEmpty(errors)) return errors;
		}
    });

    return Component;
});