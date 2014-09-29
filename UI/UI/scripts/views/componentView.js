define('ComponentView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var ComponentView;

    ComponentView = Backbone.View.extend({
        el: $('#new-component-form'),
        template: _.template($("#component-template").html()),
        inputTitle: $('#input').val(),
        inputType: function () {
            var selected = $("input:radio[name=type-options]:checked").val();
            if (selected != undefined) {
                return parseInt(selected);
            } else {
                return 0;
            }
        },

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

            $("body").append(this.template(templVariables));
            this.$el.html(this.template);
            console.log(this.model.toJSON());
            return this;
        },

        events: {
            'click #component-submit': 'submit',
            'blur': 'validate',
        },

        submit: function () {
            this.model.set({ Title: this.inputTitle, Type: this.inputType });
            console.log(this.model.toJSON());

            if (this.model.isNew()) {
                this.model.save();
            } else {
                // TODO: update model
            }
        },
        
        validate: function () {
            this.model.set({ Title: inputTitle, Type: inputType }, { validate: true });
            this.$msg.text(this.model.errors[this.name] || '')
        },
        
    });

    return ComponentView;
});
