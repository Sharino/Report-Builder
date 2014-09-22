﻿(function ($) {

    // report.js
    var Report = Backbone.Model.extend({
        defaults: {
            title: "no-title",
            id: ""
            //TODO: Add url to GET single Report item from api. For ex. url: "/api/report/THIS.ID"

        }
    });

    // reportCollection.js
    var ReportsList = Backbone.Collection.extend({
        model: Report,
        url: "/api/report/getall"
    });

    var Reports = new ReportsList;

    /*
    // reportView.js
    var ReportView = Backbone.View.extend({
        tagName: "div",
        className: "reportContainer",
        template: $("#reportTemplate").html(),

        render: function () {
            var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

            this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            return this;
        }
    });


    // app.js
    var AppView = Backbone.View.extend({
        el: $("#app")
    });
    var App = new AppView;
    */
    
    Reports.fetch({
        success: function () {
            console.log(Reports.toJSON());
        }
    });

})(jQuery);

