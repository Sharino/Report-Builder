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
        },

        events: {
            'click .component-list-item': 'onClick',
        },

        onClick: function (e) {
            console.log(e);
            e.preventDefault();
            var id = $(e.currentTarget).attr("id");
            //var item = this.collection.get(id);
            var routerUrl = "create/".concat(id);
            Backbone.history.navigate(routerUrl, true, true);
        }

    });

    return ComponentListView;
});
