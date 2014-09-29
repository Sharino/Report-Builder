define('ComponentListView', [
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone, tpl) {
    var ComponentListView;

    ComponentListView = Backbone.View.extend({
        el: $('#screen'),
        template: _.template($("#component-list-template").html()),

        initialize: function () {
            this.render;
        },
        render: function () {
            this.$el.html(this.template({ "Components": this.collection.toJSON() }));
            return this;
        }

    });

    return ComponentListView;
});
