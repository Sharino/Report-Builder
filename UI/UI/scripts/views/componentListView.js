define('ComponentListView', [
    'jquery',
    'underscore',
    'backbone',
    'ComponentCollection'
], function ($, _, Backbone, ComponentCollection) {
    var ComponentListView;

    ComponentListView = Backbone.View.extend({
        template: _.template($("#component-list-template").html()),

        initialize: function () {
            //this.render;
        },
        render: function () {
            if (this.collection) {
                this.$el.html(this.template({ "Components": this.collection.toJSON() }));
            }
            else {
                this.$el.html(this.template({ "Components": [] }));
            }
            return this;
        }

        /*,

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
        */
    });

    return ComponentListView;
});
