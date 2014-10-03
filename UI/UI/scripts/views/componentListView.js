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
            if (this.collection) {
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            }
            else {
                this.collection = new ComponentCollection();
                this.collection.on('remove', this.render, this);
                this.collection.on('fetch', this.render, this);
            }
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
        },
        
        events: {
        'click .component-list-item>.del': 'onDelete',
        'click .component-list-item>.click': 'onClick',
        },
        
        onClick: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var routerUrl = "create/".concat(id);

            Backbone.history.navigate(routerUrl, true, true);
        },

        onDelete: function (e) {
            console.log(e);
            e.preventDefault();

            var id = $(e.currentTarget).attr("id");
            var item = this.collection.get(id);

            item.destroy({
                success: function () {
                    console.log("a DELETE - success");
                },
                error: function (model, response) {
                    alert(response.status + ": " + response.statusText);
                    console.log("a DELETE - error", model, response);
                }
            });
        }
       
    });

    return ComponentListView;
});
