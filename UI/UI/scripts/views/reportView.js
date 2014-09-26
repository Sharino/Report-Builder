define('ReportView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var ReportView;
    
    ReportView = Backbone.View.extend({
        tagName: "body",
        className: "reportContainer",
        template: $("#reportTemplate").html(),
        
        initialize: function () {
            this.render;
        },
        render: function () {
            var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html

            this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
            return this;
        },

        events: {
            'click button': 'submit'
        },

        submit: function () {
			//this.model.set({id: 0});
            console.log(this.model.toJSON());
			this.model.save();
        }
    });

    return ReportView;
});
