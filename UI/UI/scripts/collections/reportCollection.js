define('ReportCollection', [
    'jquery',
    'underscore',
    'backbone',
    'Report'
], function ($, _, Backbone, Report) {
    var ReportCollection;

    ReportCollection = Backbone.Collection.extend({
        model: Report,
        url: "http://37.157.0.42:33895/api/ReportComponent"
    });

    return ReportCollection;
});