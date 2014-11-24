define('Component', [
    'jquery',
    'underscore',
    'backbone',
    'Config'
], function ($, _, Backbone, Config) {
    var Component = Backbone.Model.extend({
        urlRoot: Config.ComponentSettings.URL,

        idAttribute: "Id",

        defaults: function () {
            this.set({
                Title: "",
                Type: 1,
                Metrics: [],
                Dimensions: [],
                Filters: []
            });
        },

        validate: function (attrs, options) {
            var errors = [];

            if (!attrs.Title) {
                errors.push({ code: 521, name: 'Title', message: 'Title is required.' });
            }
            else {
                if (attrs.Title.length < 3) {
                    errors.push({ code: 522, name: 'Title', message: 'Title is too short.' });
                }
                if (attrs.Title.length > 30) {
                    errors.push({ code: 523, name: 'Title', message: 'Title is too long.' });
                }
            }

            if (!attrs.Type || (attrs.Type < 1 || attrs.Type > 4)) {
                errors.push({ code: 524, name: 'Type', message: 'Type is invalid.' });
            }
            else {
                if (attrs.Type === 1) {
                    if (attrs.Metrics.length === 0) {
                        errors.push({ code: 525, name: 'Metrics', message: 'At least one metric is required.' });
                    }
                }

                if (attrs.Type === 2) {
                    if (attrs.Metrics.length === 0) {
                        errors.push({ code: 525, name: 'Metrics', message: 'At least one metric is required.' });
                    }

                    if (attrs.Dimensions.length === 0) {
                        errors.push({ code: 526, name: 'Dimensions', message: 'At least one dimension is required.' });
                    }
                }

                if (attrs.Type === 3) {
                    if (attrs.Metrics.length === 0) {
                        errors.push({ code: 525, name: 'Metrics', message: 'At least one metric is required.' });
                    }

                    if (attrs.Dimensions.length === 0) {
                        errors.push({ code: 526, name: 'Dimensions', message: 'At least one dimension is required.' });
                    }
                }

                if (attrs.Type === 4) {
                    if (attrs.Metrics.length === 0) {
                        errors.push({ code: 525, name: 'Metrics', message: 'At least one metric is required.' });
                    }

                    if (attrs.Dimensions.length === 0) {
                        errors.push({ code: 526, name: 'Dimensions', message: 'At least one dimension is required.' });
                    }
                }
            }



//            if (attrs.Filters.length === 0) {
//                errors.push({ code: 527, name: 'Filters', message: 'At least one filter is required.' });
//            }

            if (!_.isEmpty(errors)) return errors;
        }
    });

    return Component;
});