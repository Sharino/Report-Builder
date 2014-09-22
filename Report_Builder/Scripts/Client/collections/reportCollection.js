define('ReportCollection', [
    'jquery',
    'underscore',
    'backbone',
    'ReportModel'
], function ($, _, Backbone, Client) {
    var ReportList = Backbone.Collection.extend({
        model: ReportModel,
        localStorage: new Backbone.LocalStorage("reports-backbone"),

        nextOrder: function () {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: 'order'
    });
});