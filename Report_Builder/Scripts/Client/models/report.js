define('ReportModel', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Report;
    
    Report = Backbone.Model.extend({
        defaults: {
            title: "no-title",
            id: ""
        }
    });

    return Report;
});