define('Report', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var Report;
    /*
    function reportSync(method, model, options) {
        if (method == 'GET') {
            options.url = model.url;
        } else {
            options.url = model.url + '/save';
        }
        return Backbone.sync(method, model, options);
    }
    */

    Report = Backbone.Model.extend({
        defaults: {
            title: "no-title",
            id: ""
        },
        url: "http://37.157.0.42:33895/api/ReportComponent"
        //sync: reportSync
    });

    return Report;
});