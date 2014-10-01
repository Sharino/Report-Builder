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
            this.collection.on('remove', this.render, this);
            this.render;
        },

        render: function () {
            this.$el.html(this.template({ "Components": this.collection.toJSON() }));
            return this;
        },

        events: {
            'click .component-list-item>.del': 'onDelete',
            'click .component-list-item>.click': 'onClick',
        },

        onClick: function (e) {
            console.log(e);
            e.preventDefault();
            var id = $(e.currentTarget).attr("id");
            //var item = this.collection.get(id);
            var routerUrl = "create/".concat(id);
            Backbone.history.navigate(routerUrl, true, true);
        },

        onDelete: function (e) {
            console.log(e);
            e.preventDefault();
            var id = $(e.currentTarget).attr("id");
            var item = this.collection.get(id);
            this.collection.remove(item);
            item.destroy({
                success: function () {
                    console.log("a DELETE - success");
                    //Backbone.history.navigate("list", true, true);
                    //Backbone.history.navigate("list");
                },
                error: function (model, response) {
                    alert(response.statusText);
                    console.log("a DELETE - error", model, response);
                }
            });
        },

    });


    return ComponentListView;
});
