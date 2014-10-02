define('Router', [
    'jquery',
    'underscore',
    'backbone',
    'Component',
    'ComponentCollection',
    'ComponentView',
    'ComponentListView',
    'MenuView'
], function ($, _, Backbone, Component, ComponentCollection, ComponentView, ComponentListView, MenuView) {
    var Router;
    
    Router = Backbone.Router.extend({
        routes: {
            "": "index",
            "create": "create",
            "create/:id": "createById",
            "list": "list"
        },

        index: function () {
            
        },

        create: function () {
            this.showView("#screen", new ComponentView());
        },

        list: function () {
            var self = this; // To use Router methods in callback function.

            this.ComponentsCollection = new ComponentCollection();
            this.ComponentsCollection.fetch({
                success: function (result) {
                    console.log("fetch OK", result.toJSON());
                    self.showView("#screen", new ComponentListView({ collection: result }));
                },
                error: function () {
                    console.log("fetch FAIL");
                    self.showView("#screen", new ComponentListView({ collection: null }));

                }
            });
        },

        createById: function (id) {
            var self = this;
            var tempComponentModel = new Component({ Id: id });
            tempComponentModel.fetch({
                success: function (model, response) {
                    console.log("GET", id, "Success", model, response);
                    self.showView("#screen", new ComponentView({model: tempComponentModel}));
                },
                error: function (model, response) {
                    console.log("GET", id, "Fail", model, response);
                }
            });

        },

        showView: function(selector, view) {
            if (this.currentView)
                this.currentView.close();
            $(selector).html(view.render().el);
            this.currentView = view;
            return view;
        }
    });

    return Router;
});