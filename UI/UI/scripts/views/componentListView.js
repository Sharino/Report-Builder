define('ComponentListView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var ComponentListView;

    ComponentListView = Backbone.View.extend({
        el: $('#component-list-form'),
        template: _.template($("#component-list-template").html()),

        initialize: function () {
            this.render;
        },
        render: function () {
            var tmpl = _.template($("#component-list-template").html(), {});


            this.$el.html(tmpl({ "Components": this.collection.toJSON() }));
            return this;
        }

    });

    return ComponentListView;
});
