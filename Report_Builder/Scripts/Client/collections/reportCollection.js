define('ReportCollection', [
    'jquery',
    'underscore',
    'backbone',
    'ReportModel'
], function ($, _, Backbone, Report) {
    var ReportCollection;

    ReportCollection = Backbone.Collection.extend({
        model: Report,
        url: "/api/report/getall"
    });

    return ReportCollection;
});