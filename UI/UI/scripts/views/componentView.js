define('ComponentView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var ComponentView;

    ComponentView = Backbone.View.extend({
        el: $('#screen'),
        template: _.template($("#component-template").html()),
        
        initialize: function () {
            this.$msg = $('[data-msg=' + this.name + ']');
            this.render;
        },

        render: function () {
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.model.isNew()) {
                $(".form-horizontal.well").prepend("<h1>Create a New Component</h1>");
            } else {
                $(".form-horizontal.well").prepend("<h1>Edit</h1>");
            }

            /*$("body").append( this.template(templVariables) );
            this.$el.html({ data: this.template });
            console.log(this.model.toJSON());*/
            this.$el.html(this.template({ "data": this.model.toJSON() }));
            return this;
        },

        events: {
            'click #component-submit': 'submit',
        },

        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType() });
            console.log(this.model.toJSON());

            this.model.save({}, {
                success: function (model, response) {
                    console.log("a POST save - success", model, response);
                    Backbone.history.navigate("list", true, true);
                },
                error: function (model, response) {
                    alert(response);
                    console.log("a POST save - error", model, response);
                }
            });
            return false;
        },



        inputTitle: function () {
            return $('#input').val();
        },

        inputType: function () {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },
           
    });

    return ComponentView;
});
