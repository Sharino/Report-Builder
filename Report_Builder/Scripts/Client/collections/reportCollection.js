var ReportList = Backbone.Collection.extend({
    model: Report,
    localStorage: new Backbone.LocalStorage("reports-backbone"),

    nextOrder: function () {
        if (!this.length) return 1;
        return this.last().get('order') + 1;
    },

    comparator: 'order'
});

var Reports = new ReportsList;