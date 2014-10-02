define('ComponentView', [
    'jquery',
    'underscore',
    'backbone',
    'Component'
], function ($, _, Backbone, Component) {
    var ComponentView;

    ComponentView = Backbone.View.extend({
        template: _.template($("#component-template").html()),
        model: new Component(),
        
        initialize: function () {
            //this.render;

        },

        render: function () {
            var templVariables = {
                "data": {
                    "viewTitle": "",
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.model) {       // Model exists
                if (this.model.isNew()) {
                    templVariables["data"]["viewTitle"] = "Create a New Component";
                    templVariables["data"]["activeNew"] = 'class="active"';
                } else {
                    templVariables["data"]["viewTitle"] = "Edit";
                }

                this.$el.html(this.template({ "data": this.model.toJSON() }));
            }
            else {                  // Model does not exist
                templVariables["data"]["viewTitle"] = "Create a New Component";
                templVariables["data"]["activeNew"] = 'class="active"';
                this.$el.html(this.template({ "data": [] }));
            }
            return this;
        },

        events: {
            'click #component-submit': 'submit',
        },

        submit: function () {
            this.model.set({ Title: this.inputTitle(), Type: this.inputType() });
            console.log(this.model.toJSON());

            this.model.save({}, {
                success: function (result) {
                    console.log("Save OK", result);
                },
                error: function () {
                    console.log("Save FAIL");
                }
            });

            Backbone.history.navigate("list", true, true);

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
        }
           
    });

    return ComponentView;
});
