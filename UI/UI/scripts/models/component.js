﻿define('Component', [
    'jquery',
    'underscore',
    'backbone',
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
			Dimensions: [],
			Filters: []
		},

		initialize: function(){
		    this.Metrics = new MetricCollection();
		},

		validate: function (attrs) {
            // TODO: use Backbone.validateAll
		    var errors = this.errors = [];

		    if (!attrs.Title) {
		        //errors.Title = 'Title is required';
		        errors.push({ name: 'Title', message: 'Title is required' });
		    } else if (attrs.Title.length < 3) {
		        //errors.Title = 'Title is shorter than 3 symbols';
		        errors.push({ name: 'Title', message: 'Title is shorter than 3 symbols' });
		    }

		    if (!attrs.Type || attrs.Type == 0) {
		        //errors.Type = 'Type is required';
		        errors.push({ name: 'Type', message: 'Type is required' });
		    }

		    if (!_.isEmpty(errors)) return errors;
		}
    });

    return Component;
});