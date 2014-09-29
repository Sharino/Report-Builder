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
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
            } else {
                templVariables["data"]["viewTitle"] = "Edit";
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

            this.model.save();
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
