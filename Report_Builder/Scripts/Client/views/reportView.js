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
