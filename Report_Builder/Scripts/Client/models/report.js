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
        url: "/api/report"
        //sync: reportSync
    });

    return Report;
});