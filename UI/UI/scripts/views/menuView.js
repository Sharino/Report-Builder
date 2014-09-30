define('MenuView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var MenuView;

    MenuView = Backbone.View.extend({
        el: $('#menu'),
        template: _.template($("#menu-template").html()),

        initialize: function () {
            this.render;
        },

        render: function () {
            var templVariables = {
                "data": {
                    "activeNew": "",
                    "activeList": ""
                }
            };

            if (this.model.isNew()) {
                //templVariables["data"]["activeNew"] = 'class="active"';
            } else {
                // TODO:
            }

            this.$el.html(this.template({ "data": this }));
            return this;
        }
    });

    return MenuView;
});
